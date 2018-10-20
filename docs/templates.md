## How templates work in GitHubPub

You can use the default template, or you can create your own.

### Top-level view

When GHP looks for the template to render your pages through, it looks first at the top level of your blog in a folder called <i>template</i> for a file named template.txt. If it finds it, that's what it uses. 

By convention the template folder can also have files named code.js or styles.css. As with template.txt if these files are not found in your repo, we look in the default location, which is in the githubpub <a href="https://github.com/scripting/githubpub/tree/master/defaultfiles/template">repository</a>.

The net-effect is that you can use the default template by doing nothing, or can customize or replace it by editing files in your repo.

