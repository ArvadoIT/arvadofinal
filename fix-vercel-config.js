#!/usr/bin/env node

/**
 * Fix Vercel Project Configuration
 * 
 * This script will:
 * 1. Enable auto-deploy
 * 2. Set production branch to 'main'
 * 
 * Note: Repository connection must be fixed manually in Vercel Dashboard
 * because it requires re-authentication.
 */

const projectId = 'prj_hGUzz36fOGPv5xtliIimZML5hcWM';
const token = process.env.VERCEL_TOKEN;

if (!token) {
  console.error('❌ Error: VERCEL_TOKEN environment variable is required');
  process.exit(1);
}

async function fixConfiguration() {
  try {
    console.log('\n🔧 Fixing Vercel Project Configuration...\n');

    // Update project settings
    const updateResponse = await fetch(`https://api.vercel.com/v9/projects/${projectId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Note: autoDeployOnPush might need to be set via v1 API
        // Let's try both approaches
      })
    });

    // Try v1 API for settings
    const v1Response = await fetch(`https://api.vercel.com/v1/projects/${projectId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        autoDeployOnPush: true,
        productionBranch: 'main'
      })
    });

    if (v1Response.ok) {
      const result = await v1Response.json();
      console.log('✅ Successfully updated project settings!');
      console.log(`   Auto-deploy: ${result.autoDeployOnPush ? '✅ Enabled' : '❌ Disabled'}`);
      console.log(`   Production Branch: ${result.productionBranch || 'Not set'}`);
    } else {
      const error = await v1Response.text();
      console.log('⚠️  Could not update via v1 API, trying alternative method...');
      console.log(`   Error: ${error}`);
    }

    // Verify current settings
    console.log('\n📋 Current Configuration:');
    const checkResponse = await fetch(`https://api.vercel.com/v1/projects/${projectId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (checkResponse.ok) {
      const settings = await checkResponse.json();
      console.log(`   Auto-deploy: ${settings.autoDeployOnPush ? '✅ Enabled' : '❌ Disabled'}`);
      console.log(`   Production Branch: ${settings.productionBranch || 'Not set'}`);
    }

    console.log('\n⚠️  IMPORTANT: Repository connection must be fixed manually!');
    console.log('   1. Go to: https://vercel.com/[your-team]/arvadofinaldeploy/settings/git');
    console.log('   2. Click "Disconnect"');
    console.log('   3. Click "Connect Git Repository"');
    console.log('   4. Select: ArvadoIT/Arvadofinal');
    console.log('');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

fixConfiguration();

