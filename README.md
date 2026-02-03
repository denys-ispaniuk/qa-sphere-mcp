# QA Sphere MCP Server

A complete Model Context Protocol (MCP) server for QA Sphere integration with full API support. Allows AI assistants like Cursor to interact with QA Sphere test management system.

## ✨ Features

- **📁 Projects** - Get all projects or specific project details
- **📝 Test Cases** - Full CRUD operations (Create, Read, Update, Delete)
- **📂 Folders** - Organize test cases with folders
- **🏷️ Tags** - Categorize test cases with tags
- **📋 Preconditions** - Manage shared preconditions
- **📊 Test Plans** - Get and create test plans
- **🎯 Requirements** - Link requirements to test cases

## 📦 Installation

### Using with npx (Recommended - No installation needed)

```bash
npx -y qasphere-mcp
```

### Global Installation

```bash
npm install -g qasphere-mcp
```

## 🚀 Quick Setup with Cursor

### Step 1: Get Your QA Sphere API Key

1. Log in to your QA Sphere account
2. Click on your profile (top right)
3. Go to **Settings** → **API Keys**
4. Click **Create API Key**
5. Copy the generated API key

### Step 2: Configure Cursor

1. Open Cursor Settings (`Ctrl/Cmd + ,`)
2. Search for "MCP" or go to **Features** → **Model Context Protocol**
3. Click **Edit Config** or open the config file
4. Add the following configuration (also available in `cursor-config.example.json`):

```json
{
  "mcpServers": {
    "qasphere": {
      "command": "npx",
      "args": ["-y", "qasphere-mcp"],
      "env": {
        "QASPHERE_API_KEY": "your-api-key-here",
        "QASPHERE_BASE_URL": "https://your-company.your-region.qasphere.com/api/public/v0"
      }
    }
  }
}
```

5. Replace the following values:
   - `your-api-key-here` - with your API key from Step 1
   - `https://your-company.your-region.qasphere.com/api/public/v0` - with your QA Sphere URL

6. Save the config file
7. Restart Cursor

### Step 3: Verify It Works

Open Cursor chat and try:

```
Show me all QA Sphere projects
```

If everything is configured correctly, you'll see your QA Sphere projects! 🎉

## 🔧 Environment Variables

Configure these in your Cursor MCP config (as shown above):

- `QASPHERE_API_KEY` - Your QA Sphere API key (required)
- `QASPHERE_BASE_URL` - Your QA Sphere instance URL (required)
  - Format: `https://{company}.{region}.qasphere.com/api/public/v0`
  - Example: `https://home-923.eu1.qasphere.com/api/public/v0`
- `LOG_LEVEL` - Optional: `debug`, `info`, `warn`, `error` (default: `info`)
- `REQUEST_TIMEOUT` - Optional: Timeout in milliseconds (default: `30000`)

## 🛠️ Available Tools (25 methods)

### Projects (2 tools)
- `qasphere_list_projects` - Get all projects
- `qasphere_get_project` - Get project details by ID

### Test Cases (6 tools) ⭐
- `qasphere_list_test_cases` - List test cases with filters
- `qasphere_get_test_case` - Get test case details
- `qasphere_create_test_case` - Create new test case
- `qasphere_update_test_case` - Update test case (full)
- `qasphere_patch_test_case` - Partially update test case
- `qasphere_delete_test_case` - Delete test case

### Folders (5 tools)
- `qasphere_list_folders` - List folders in project
- `qasphere_get_folder` - Get folder details
- `qasphere_create_folder` - Create new folder
- `qasphere_update_folder` - Update folder
- `qasphere_delete_folder` - Delete folder

### Tags (4 tools)
- `qasphere_list_tags` - List tags in project
- `qasphere_create_tag` - Create new tag
- `qasphere_update_tag` - Update tag
- `qasphere_delete_tag` - Delete tag

### Preconditions (2 tools)
- `qasphere_list_preconditions` - List shared preconditions
- `qasphere_create_precondition` - Create new precondition

### Test Plans (3 tools)
- `qasphere_list_test_plans` - List test plans
- `qasphere_get_test_plan` - Get test plan details
- `qasphere_create_test_plan` - Create new test plan

### Requirements (3 tools)
- `qasphere_list_requirements` - List requirements
- `qasphere_get_requirement` - Get requirement details
- `qasphere_link_requirement` - Link requirement to test case

## 💡 Usage Examples in Cursor

### Example 1: List Projects

```
Show me all my QA Sphere projects
```

### Example 2: Create Test Case

```
Create a new test case in project abc123:
- Title: "Login with valid credentials"
- Priority: high
- Steps:
  1. Navigate to login page
  2. Enter valid username and password
  3. Click login button
- Expected: User should be logged in successfully
```

### Example 3: Organize Tests

```
Create a folder called "Authentication Tests" in project abc123, 
then create 3 test cases for login, logout, and password reset
```

### Example 4: Bulk Operations

```
List all test cases in project abc123 that have the tag "regression"
```

## 📖 API Response Format

All tools return JSON responses:

### Success Response
```json
{
  "success": true,
  "data": { /* API response data */ },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* Additional context */ }
  }
}
```

## 🔍 Error Codes

- `AUTH_ERROR` - Authentication failed (check API key)
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request parameters
- `SERVER_ERROR` - QA Sphere server error
- `API_ERROR` - General API error
- `TOOL_NOT_FOUND` - Unknown tool requested
- `UNKNOWN_ERROR` - Unexpected error

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- QA Sphere account with API access

### Build from Source

```bash
git clone https://github.com/denys-ispaniuk/qasphere-mcp.git
cd qasphere-mcp
npm install
npm run build
```

### Local Development

```bash
npm run dev  # Watch mode
```

### Testing Locally

Create a `.env` file:

```bash
QASPHERE_API_KEY=your-key
QASPHERE_BASE_URL=https://your-company.your-region.qasphere.com/api/public/v0
```

Run:

```bash
npm start
```

## 📝 Publishing to npm

```bash
npm run build
npm publish
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/denys-ispaniuk/qasphere-mcp/issues)
- **Email**: support@qasphere.com
- **Documentation**: https://docs.qasphere.com/api/api_intro

## 🗺️ Roadmap

- [ ] Support for test runs and results
- [ ] Batch operations for bulk updates
- [ ] Caching for improved performance
- [ ] Custom field support
- [ ] File upload capabilities
- [ ] Webhook integration

## 📝 Changelog

### 0.1.0 (Initial Release)

- ✅ 25 tools for test management
- ✅ Projects, test cases, folders, tags support
- ✅ Preconditions, test plans, requirements support
- ✅ Full CRUD operations
- ✅ Type-safe TypeScript implementation
- ✅ Comprehensive error handling
- ✅ Works with npx - no installation needed

---

**Made with ❤️ for QA professionals using AI-powered workflows**

## 🔗 Related Projects

- [TestRail MCP](https://www.npmjs.com/package/mcp-testrail) - MCP server for TestRail
- [Model Context Protocol](https://modelcontextprotocol.io/) - Official MCP documentation
