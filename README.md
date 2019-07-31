# Blekathlon - Modern, elegant and fast Bludit theme for your blog, portfolio or showcase site
![screenshot](https://blthemes.pp.ua/blekathlon/bl-content/uploads/blekathlon.png
 "Blekathlon")

[Live Demo](https://blthemes.pp.ua/blekathlon/)

BlThemes - Themes for [Bludit](https://github.com/bludit/bludit) CMS version 3+

## Changelog

v3.9.0

* Added Medium style Image Zoom to Article images. [Demo](https://blthemes.pp.ua/blekathlon/medium-style-zoom)
* Search results are cached for one hour only.
* Downloads moved to [Gumroad](https://blthemes.pp.ua/blekathlon/blekathlon-info). 
* Fixed issues with [search](https://github.com/blthemes/Blekathlon/issues/8).

v3.8.1  

* IMPORTANT: Due to some user complaints, the use of CDN for images and image resizing has been disabled. If you want to use it again in `init.php` change this line:
```
$helper = new Helper($useCdn=false);
```  
to  
```
$helper = new Helper($useCdn=true);
```  
* Support for Cyrillic in search.
* Search now is case-insensitive.
* Autofocus search field on open.
* All strings in front-end can be translated.



v3.8.0  

* Improved search - no extra plugin is needed. Faster and most memory-flexible full-text search. Now include accents and diacritics.  
* Added support for Site logo.  
* Removed some unnecessary code.  
* Other small bug fixes and improvements

v3.0.0  

- Initial release