## How templates work in GitHubPub

You can use the default template, or you can create your own.

### Top-level view

When GHP looks for the template to render your pages through, it looks first at the top level of your blog in a folder called <i>template</i> for a file named template.txt. If it finds it, that's what it uses. 

By convention the template folder can also have files named code.js or styles.css. As with template.txt if these files are not found in your repo, we look in the default location, which is in the githubpub <a href="https://github.com/scripting/githubpub/tree/master/defaultfiles/template">repository</a>.

The net-effect is that you can use the default template by doing nothing, or can customize or replace it by editing files in your repo.

### Macros

Macros are contained within [% and %].

The values of macros can come from system values, like now (the time when the page is generated), title (the title of the page), or from the metadata stored with the post such as when it was created and modified, the description and bodytext. 

For a complete list of system macros, for now, look at renderThroughTemplate in githubpub.js (sorry for making you read the code). 

### flHomePage

There's a special bit of metadata called flHomePage. If present in the page, and true, GHP generates the bodytext as a reverse-chronologic list of recent posts, the description and publication date, and a link to the page for the post. 

