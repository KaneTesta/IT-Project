---
title: Automatic Contents Page
category: Wiki
author: Joel Launder
---

The contents page is generated automatically from the files in the `docs/content/` folder. This guide explains how to make a new page that is included in the contents page.

## Front Matter

Jekyll uses front matter on pages which is included at the start of every page file. For a page to be included in the front matter must be formatted as follows:

```md
---
title: My Title
category: My Category
author: My Name
---
```

The `category` value can be anything, but new categories must be added to the `content_categories` in `_config.yml` in order to show up in the contents page. Normal markdown can be written after the second `---` as usual.
