---
title: "Populating a theme for testing"
date: "2022-12-19"
---

When you start a new site for developing the site has no data and there is no way to see what the theme would look like with content in it.

We will discuss three approaches to populating a theme with data to see what it would look like:

1. Cloning the data from your production site
2. Using [WordPress Theme Data](https://github.com/WPTT/theme-test-data)
3. Using [Gutenberg Test Data](https://github.com/Automattic/theme-tools/tree/master/gutenberg-test-data)

Each of these strategies addresses different needs and use cases.

## Cloning data from your production site

The easiest way to get data for your development system is to take the data from your production system and import it into development.

Doing this is a two-step process.

1. In the production server:
    
    1. Go to Tools => Export => WordPress
    2. Select `All content`
    
    - Alternatively you can select the specific type of content that you want to export. This will allow you to create export files for each type of content you have available
        
        1. Click `Download Export File`
2. In the development server:
    
    1. Go to Tools => Import => WordPress
    2. Select the XML file from your computer
    3. Click on `Upload file and import`
    4. Under `Import Attachments`, check the `Download and import file attachments` box and click submit

**Note:** You may have to repeat the Import step until you see "All Done" to obtain the full list of Posts and Media.

Downloading and importing file attachments means that the production server must be up and running when you import the data.

This backup will also backup the data for custom post types but will not create the custom post types on the development system.

## Using WordPress Theme Data

The WordPress Theme Data project (formerly known as [WordPress Theme Unit Test](https://codex.wordpress.org/Theme_Unit_Test) provides a ready-made backup file that you can upload to your development server to validate your theme.

You can download the backup file from the WordPress Theme Team's [Github Repository](https://github.com/WPTT/theme-test-data)

Then the process is the same as the restore process for uploading your own content.

This should give you a good starting point for your work since it covers most of the default content of a WordPress theme.

## Using Gutenberg Test Data

[Gutenberg Test Data](https://github.com/Automattic/theme-tools/tree/master/gutenberg-test-data) addresses items specific to the block editor and don't appear, yet, in the default theme test data file.

You can download the data from the Gutenberg Test Data [Github repository](https://github.com/Automattic/theme-tools/tree/master/gutenberg-test-data)

Importing the backup file follows the same steps as the Theme Data backup in the previous section.

This will give you Gutenberg-specific posts to experiment with using things that may not necessarily appear in classic themes.

## Links

- [WordPress Theme Data](https://github.com/WPTT/theme-test-data)
- [Gutenberg Test Data](https://github.com/Automattic/theme-tools/tree/master/gutenberg-test-data)
- [a11y Theme Unit Test](https://github.com/wpaccessibility/a11y-theme-unit-test)
