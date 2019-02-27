<?php
class Helper
{
	public static function cdn_that_image($image, $width)
    {
		if ( 0 === strpos( $image, '//' ) ) {
			$image = 'https:' . $image;
		}
		$image_url_parts = @parse_url( $image );

		if ( ! is_array( $image_url_parts ) || empty( $image_url_parts['host'] ) || empty( $image_url_parts['path'] ) ) return $image;
		if( strpos( $image_url_parts['host'], 'localhost') !== false || strpos( $image_url_parts['host'], '127.0.0.1') !== false) return $image;
		
		$image_host_path = $image_url_parts['host'] . $image_url_parts['path'];	
		
		$cdn_url  = "https://i.meln.top/";		
		$cdn_url .= 'width/' . $width . '/n/'. $image_host_path; //resize image, keep proportions
		
        return $cdn_url;
    }

	public static function cdn_cover_image($image, $width, $height)
    {
		if ( 0 === strpos( $image, '//' ) ) {
			$image = 'https:' . $image;
		}
		$image_url_parts = @parse_url( $image );

		if ( !is_array( $image_url_parts ) || empty( $image_url_parts['host'] ) || empty( $image_url_parts['path'] ) ) return $image;
		if( strpos( $image_url_parts['host'], 'localhost') !== false || strpos( $image_url_parts['host'], '127.0.0.1') !== false) return $image;
		
		$image_host_path = $image_url_parts['host'] . $image_url_parts['path'];	
		
		$cdn_url  = "https://i.meln.top";		
		$cdn_url .= '/cover/' . $width .'x'.$height. '/n/'. $image_host_path; //resize image, keep proportions
		
        return $cdn_url;
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
        global $page;
		global $pages;
		if($page->isStatic()) return false;
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
        global $page;
		global $pages;
		if($page->isStatic()) return false;
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
                $description = trim($description);
            }
        } elseif ($WHERE_AM_I == 'category') {
            try {
                $categoryKey = $url->slug();
                $category = new Category($categoryKey);
                $description = $category->description();
            }
			catch (Exception $e) {
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
            }
			catch (Exception $e) {
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
            }
			catch (Exception $e) {
				// slogan from the site
            }
        }
        return $slogan;
    }


    public static function content2excerpt($cont)
    {
        $cont = str_replace('<', ' <', $cont);
        $cont = html_entity_decode($cont);
        $description = Text::truncate(Text::removeHTMLTags($cont), 250);
        $description = trim( $description);
        return $description;
    }

    /**
	 * Summary of getRelated
	 * @param mixed $max
	 * @param mixed $similar
	 * @return array[]|string
	 */
    public static function getRelated($max = 3, $similar = true)
    {
        global $WHERE_AM_I;
        global $page;
        if ($WHERE_AM_I == 'page') {
            $currentKey = $page->key();
            if (!$page->category()) return false;
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
        return false;
    }

	/**
	 * Limit text to number of words
	 * @param string $text The input string
	 * @param int $limit Number of words to return
	 * @param string $ending Text to add at end
	 * @return string
	 */
	function limit_text_words($text, $limit, $ending = '...') {
		if (str_word_count($text, 0) > $limit) {
			$words = str_word_count($text, 2);
			$pos = array_keys($words);
			$text = substr($text, 0, $pos[$limit]) . $ending;
		}
		return $text;
    }

}