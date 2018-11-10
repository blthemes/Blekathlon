<?php
class Helper
{
    public static function catch_that_image()
    {
        global $page;
        $first_img = $page->coverImage();
        if (!empty($first_img)) {
            return $first_img;
        }
        preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $page->content(), $matches);
        if (isset($matches[1][0])) {
            $first_img = $matches[1][0];
        }
        if (empty($first_img)) {
            $first_img = "";
        }
        return $first_img;
    }

	
    public static function get_thumb()
    {
        global $page;
        $first_img = $page->thumbCoverImage();
        if (empty($first_img)) {
            preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $page->content(), $matches);
            if (isset($matches[1][0])) {
                $first_img = $matches[1][0];
            }
        }        
        return $first_img;
    }

   
    public function previousKey()
    {
        global $pages;
        global $page;
        if (method_exists($page, 'previousKey')) return $page->previousKey(); //from Bludit 3 this is core function
        $currentKey = $page->key();
        $keys = $pages->getPublishedDB(true);
        $position = array_search($currentKey, $keys) + 1;
        if (isset($keys[$position])) {
            return $keys[$position];
        }
        return false;
    }

    public function nextKey()
    {
        global $pages;
        global $page;
        if (method_exists($page, 'nextKey')) return $page->nextKey(); //from Bludit 3 this is core function
        $currentKey = $page->key();
        $keys = $pages->getPublishedDB(true);
        $position = array_search($currentKey, $keys) - 1;
        if (isset($keys[$position])) {
            return $keys[$position];
        }
        return false;
    }
    
    public function head_description()
    {
        global $site;
        global $WHERE_AM_I;
        global $page;
        global $url;

        $description = $site->description();

        if ($WHERE_AM_I == 'page') {
            $description = $page->description();
            if (empty($description)) {
                $cont = str_replace('<', ' <', $page->content(false));
                $cont = html_entity_decode($cont);
                $description = Text::truncate(Text::removeHTMLTags($cont), 250);
                $description = trim(preg_replace('/\s+/', ' ', $description));//remove repeated spaces
            }
        } elseif ($WHERE_AM_I == 'category') {
            try {
                $categoryKey = $url->slug();
                $category = new Category($categoryKey);
                $description = $category->description();
            } catch (Exception $e) {
				// description from the site
            }
        }
        return '<meta name="description" content="' . $description . '">' . PHP_EOL;
    }

	public function description()
    {
        global $site;
        global $WHERE_AM_I;
        global $url;

        $description = $site->description();

        if ($WHERE_AM_I == 'category') {
            try {
                $categoryKey = $url->slug();
                $category = new Category($categoryKey);
                $description = $category->description();
            } catch (Exception $e) {
				// description from the site
            }
        }
        return $description;
    }

	public function slogan()
    {
        global $site;
        global $WHERE_AM_I;
        global $url;
        $slogan = $site->slogan();
        if ($WHERE_AM_I == 'category') {
            try {
                $categoryKey = $url->slug();
                $category = new Category($categoryKey);
                $slogan = $category->name();
            } catch (Exception $e) {
				// slogan from the site
            }
        }
        return $slogan;
    }

    public static function content2description($cont)
    {
        $cont = str_replace('<', ' <', $cont);
        $cont = html_entity_decode($cont);
        $description = Text::truncate(Text::removeHTMLTags($cont), 250);
        $description = trim(preg_replace('/\s+/', ' ', $description));//remove repeated spaces
        return $description;
    }

    public static function getRelated($max = 3, $similar = true)
    {
        global $WHERE_AM_I;
        global $page;
        if ($WHERE_AM_I == 'page') {
            $currentKey = $page->key();
            if (!$page->category()) return '';
            $currentCategory = getCategory($page->categoryKey());
            if (count($currentCategory->pages()) >= $max + 1) {
                $allCatPages = $currentCategory->pages();
				//remove curent page
                $allCatPages = array_diff($allCatPages, array($currentKey));

				//sort rest pages by similarity O(N**3)
                if ($similar) {
                    usort($allCatPages, function ($a, $b) use ($currentKey) {
                        similar_text($currentKey, $a, $percentA);
                        similar_text($currentKey, $b, $percentB);
                        return $percentA === $percentB ? 0 : ($percentA > $percentB ? -1 : 1);
                    });
                }
				//or just randomize
                else {
                    shuffle($allCatPages);
                }
                $related = array();
                for ($i = 0; $i < $max; $i++) {
                    $item = new Page($allCatPages[$i]);
                    if ($item->published()) {
                        $related[] = array(
                            'title' => $item->title(),
                            'link' => $item->permalink(),
                            'image' => $item->coverImage(),
							'thumb' => $item->thumbCoverImage()
                        );
                    }
                }
                return $related;
            }

        }
        return '';
    }
}

