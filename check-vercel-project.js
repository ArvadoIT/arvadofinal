#!/usr/bin/env node

/**
 * Check Vercel Project Configuration
 * 
 * Usage:
 *   VERCEL_TOKEN=your_token node check-vercel-project.js
 * 
 * Or get token from: https://vercel.com/account/tokens
 */

const projectId = 'prj_hGUzz36fOGPv5xtliIimZML5hcWM';
const token = process.env.VERCEL_TOKEN;

if (!token) {
  console.error('❌ Error: VERCEL_TOKEN environment variable is required');
  console.log('\nTo get your token:');
  console.log('1. Go to https://vercel.com/account/tokens');
  console.log('2. Create a new token');
  console.log('3. Run: VERCEL_TOKEN=your_token node check-vercel-project.js');
  process.exit(1);
}

async function checkProject() {
  try {
    // Get project details
    const projectResponse = await fetch(`https://api.vercel.com/v9/projects/${projectId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!projectResponse.ok) {
      const error = await projectResponse.text();
      throw new Error(`API Error: ${projectResponse.status} - ${error}`);
    }

    const project = await projectResponse.json();

    console.log('\n📦 VERCEL PROJECT CONFIGURATION\n');
    console.log('═'.repeat(60));
    console.log(`Project Name:     ${project.name}`);
    console.log(`Project ID:       ${project.id}`);
    console.log(`Account ID:       ${project.accountId}`);
    console.log(`Framework:        ${project.framework || 'Not set'}`);
    console.log(`Node Version:     ${project.nodeVersion || 'Not set'}`);
    console.log('═'.repeat(60));
    
    // Check Git connection
    console.log('\n🔗 GIT CONNECTION\n');
    console.log('═'.repeat(60));
    
    if (project.link) {
      const link = project.link;
      console.log(`Repository:       ${link.repo}`);
      console.log(`Type:             ${link.type}`);
      console.log(`Repo ID:          ${link.repoId || 'N/A'}`);
      console.log(`Org:              ${link.org || 'N/A'}`);
      console.log(`Git Credential:   ${link.gitCredentialId || 'N/A'}`);
      console.log(`Created:          ${new Date(link.createdAt).toLocaleString()}`);
      
      // Check if it's the wrong repo
      const currentRepo = link.repo;
      const correctRepo = 'ArvadoIT/Arvadofinal';
      
      if (currentRepo.toLowerCase() !== correctRepo.toLowerCase()) {
        console.log('\n⚠️  WARNING: Repository mismatch detected!');
        console.log(`   Current:  ${currentRepo}`);
        console.log(`   Expected: ${correctRepo}`);
        console.log('\n   This is why auto-deployments are not working!');
      } else {
        console.log('\n✅ Repository connection looks correct!');
      }
    } else {
      console.log('❌ No Git repository connected!');
      console.log('   This is why auto-deployments are not working!');
    }
    
    // Get deployment settings
    console.log('\n⚙️  DEPLOYMENT SETTINGS\n');
    console.log('═'.repeat(60));
    
    const settingsResponse = await fetch(`https://api.vercel.com/v1/projects/${projectId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (settingsResponse.ok) {
      const settings = await settingsResponse.json();
      console.log(`Auto-deploy:      ${settings.autoDeployOnPush ? '✅ Enabled' : '❌ Disabled'}`);
      console.log(`Production Branch: ${settings.productionBranch || 'Not set'}`);
      console.log(`Ignored Build Step: ${settings.ignoredBuildStep || 'None'}`);
    }

    // Get recent deployments
    console.log('\n📋 RECENT DEPLOYMENTS (last 3)\n');
    console.log('═'.repeat(60));
    
    const deploymentsResponse = await fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=3`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (deploymentsResponse.ok) {
      const deployments = await deploymentsResponse.json();
      if (deployments.deployments && deployments.deployments.length > 0) {
        deployments.deployments.forEach((deployment, index) => {
          console.log(`\n${index + 1}. ${deployment.url || 'N/A'}`);
          console.log(`   Status: ${deployment.readyState}`);
          console.log(`   Branch: ${deployment.meta?.githubCommitRef || 'N/A'}`);
          console.log(`   Commit: ${deployment.meta?.githubCommitSha?.substring(0, 7) || 'N/A'}`);
          console.log(`   Message: ${deployment.meta?.githubCommitMessage || 'N/A'}`);
          console.log(`   Created: ${new Date(deployment.createdAt).toLocaleString()}`);
        });
      } else {
        console.log('No deployments found');
      }
    }

    console.log('\n' + '═'.repeat(60));
    console.log('\n✅ Check complete!\n');

  } catch (error) {
    console.error('\n❌ Error checking project:', error.message);
    if (error.message.includes('401') || error.message.includes('403')) {
      console.log('\n💡 Tip: Your token might be invalid or expired.');
      console.log('   Get a new token at: https://vercel.com/account/tokens');
    }
    process.exit(1);
  }
}

checkProject();

