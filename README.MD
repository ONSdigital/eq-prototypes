# eQ prototypes


## Install
Install [RVM](https://rvm.io/) and run:
- `gem install bundler`
- `git clone git@github.com:ONSdigital/eq-prototypes.git`
- `cd eq-prototypes`
- `bundle install`
- `npm install`

## Run
Install [node](https://nodejs.org/en/) and [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) and then run:
- `gulp` to build


## Developement
Run `gulp dev` to run in development (localhost:4000 by default)


## View Prototypes
- Each branch will be deployed to Netlify once a pull request is made. The latest of the master branch is available at:
[http://onsdigital.github.io/eq-prototypes/](http://onsdigital.github.io/eq-prototypes/)


## Javascript development
To build custom code with access to pattern library modules
- Create a bundle.js file in any folder inside _prototypes/.
- Reference pattern library modules in ./_js/modules/
- Run gulp from the command line in the root of the project.
- A corresponding compiled bundle.js with be written to the folder js/compiled/
- Reference the generated bundle.js in your HTML file(s).

## CDN Version
Default css CDN version: `v1.0.0`
To use a specific version add `cdn: v1.0.1` to `_prototypes/yourprototype/yourversion/yourtemplate.html`
