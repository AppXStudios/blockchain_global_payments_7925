# BGP Branch Management Instructions

## Production Branch Strategy

### Main Branch (`main`)
- **Purpose**: Production-ready code only
- **Protection**: Branch protection rules enabled
- **Deployment**: Auto-deploys to Vercel production
- **Access**: Requires code review and approval

### Development Branch (`dev`)
- **Purpose**: Integration branch for new features
- **Testing**: All features tested before merging to main
- **Deployment**: Auto-deploys to Vercel preview environment

## Getting Started

### 1. Download Project
- Download project as ZIP file
- Extract files to your local development environment

### 2. Upload to GitHub
1. Create new repository on GitHub
2. Initialize git in project directory:
   ```bash
   git init
   git add .
   git commit -m "Initial BGP deployment setup"
   ```
3. Add remote origin:
   ```bash
   git remote add origin https://github.com/yourusername/bgp-project.git
   ```
4. Push to main branch:
   ```bash
   git branch -M main
   git push -u origin main
   ```

### 3. Set Main as Default Branch
1. Go to GitHub repository settings
2. Navigate to "Branches" section
3. Set "main" as default branch
4. Enable branch protection rules:
   - Require pull request reviews
   - Require status checks to pass
   - Restrict pushes to main branch

### 4. Create Development Branch
```bash
git checkout -b dev
git push -u origin dev
```

## Deployment Workflow

### Feature Development
1. Create feature branch from `dev`
2. Develop and test feature
3. Create pull request to `dev` branch
4. Review and merge to `dev`

### Production Release
1. Create pull request from `dev` to `main`
2. Comprehensive testing and review
3. Merge to `main` triggers production deployment

## Branch Protection Rules

### Main Branch Protection
- Require pull request reviews before merging
- Dismiss stale PR approvals when new commits are pushed
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Include administrators in restrictions

### Recommended Checks
- Build process must complete successfully
- No merge conflicts
- Code review by at least one team member
- All tests passing (when implemented)

## File Management

### Never Commit
- `.env.local` files
- Node modules
- Build artifacts
- Secret keys or tokens
- Local configuration files

### Always Commit
- Source code
- Configuration templates
- Documentation
- Package.json and lock files
- Public assets

## Security Considerations

### Environment Variables
- Use Vercel's environment variable system
- Never commit sensitive data to repository
- Separate development and production keys

### Access Control
- Limit repository access to authorized team members
- Use GitHub's team and permission system
- Regular audit of repository access

## Troubleshooting

### Common Issues
1. **Merge Conflicts**: Resolve conflicts before merging
2. **Build Failures**: Check build logs and fix errors
3. **Environment Issues**: Verify all required env vars are set

### Getting Help
- Check GitHub Actions logs for deployment issues
- Review Vercel deployment logs
- Consult the DEPLOYMENT.md guide for configuration help