<div class="single">
	<main class="site-content" role="main">
		<article class="hentry">
			<?php Theme::plugins('pageBegin'); ?>
			<header class="entry-header page-header text-center">
				<h1 class="entry-title title-font text-italic">
					<?php echo $page->title(); ?>
				</h1>
				<?php if($login->isLogged()) if($canEdit = checkRole(array('admin', 'editor'))):?>
				<a href="<?php echo HTML_PATH_ADMIN_ROOT.'edit-content/'.$page->slug() ?>" style="float:right" target="_blank">
					<svg class="icon" viewBox="0 0 32 32">
						<use xlink:href="#icon-pencil"></use>
					</svg>
					<span><?php echo $L->get('Edit'); ?></span>
				</a>
				<?php endif; ?>
			</header>
			<?php if ($page->coverImage()): ?>
			<div class="entry-media post-thumbnail post-thumbnail-singular">
				<img src="<?php echo $page->coverImage() ?>" alt="<?php echo $page->title() ?>" />
			</div>
			<?php endif; ?>

			<div class="entry-content">
				<div class="page-content">
					<?php echo $page->content(); ?>
				</div>
				<?php if(!$page->isStatic()):?>
				<span class="posted-on">
					<span class="screen-reader-text">Posted on</span>
					<time class="entry-date published soft-color" datetime="<?php echo $page->dateRaw('c') ?>">
						<?php echo $page->date() ?>
					</time>
					<?php
                          $lastmod = $page-> dateModified();
                          if(!empty($lastmod)): ?>
					<time class="updated" datetime="<?php echo Date::format($lastmod, DB_DATE_FORMAT,'c') ?>"></time>
					<?php endif; ?>
				</span>
				<?php endif; ?>
			</div>

			<footer class="entry-footer clear">
				<div class="share-buttons">
					<a href="http://twitter.com/intent/tweet?url=<?php echo urlencode ($page->permalink()) ?>&amp;text=<?php echo urlencode($page->description()) ?>"
						rel="noopener noreferrer external nofollow" class="c-btn-share  c-btn-twitter" target="_blank">
						<svg class="c-share-icon  c-share-icon-twitter">
							<use xlink:href="#icon-twitter"></use>
						</svg>
						<?php echo $L->get('Tweet'); ?>
					</a>
					<a href="https://www.facebook.com/sharer.php?u=<?php echo urlencode ($page->permalink()) ?>&amp;t=<?php echo urlencode($page->description()) ?>"
						rel="noopener noreferrer external nofollow" class="c-btn-share  c-btn-facebook" target="_blank">
						<svg class="c-share-icon  c-share-icon-facebook">
							<use xlink:href="#icon-facebook"></use>
						</svg>
						<?php echo $L->get('Share'); ?>
					</a>
				</div>
				<?php if ($page->category()): ?>
				<div class="entry-terms-wrapper entry-categories-wrapper clear">
					<span class="screen-reader-text">Categories: </span>
					<span class="icon-wrapper">
						<svg class="icon icon-folder-open" aria-hidden="true" viewBox="0 0 34 32" role="img">
							<path d="M33.6 17q0 0.6-0.6 1.2l-6 7.1q-0.8 0.9-2.2 1.5t-2.6 0.6h-19.4q-0.6 0-1.1-0.2t-0.5-0.8q0-0.6 0.6-1.2l6-7.1q0.8-0.9 2.2-1.5t2.6-0.6h19.4q0.6 0 1.1 0.2t0.5 0.8zM27.4 10.9v2.9h-14.9q-1.7 0-3.5 0.8t-2.9 2.1l-6.1 7.2q0-0.1 0-0.2t0-0.2v-17.1q0-1.6 1.2-2.8t2.8-1.2h5.7q1.6 0 2.8 1.2t1.2 2.8v0.6h9.7q1.6 0 2.8 1.2t1.2 2.8z"></path>
						</svg>
					</span>
					<span class="entry-terms category">
						<a href="<?php echo DOMAIN_CATEGORIES.$page->categoryKey() ?>" rel="tag">
							<?php echo $page->category() ?>
						</a>
					</span>
				</div>
				<?php endif; ?>
				<?php if ($page->tags()):?>
				<div class="entry-terms-wrapper entry-tags-wrapper clear">
					<span class="screen-reader-text">Tags: </span>
					<span class="icon-wrapper">
						<svg class="icon icon-tag" viewBox="0 0 27 32" aria-hidden="true" role="img">
							<path class="path1" d="M8 8q0-0.9-0.7-1.6t-1.6-0.7-1.6 0.7-0.7 1.6 0.7 1.6 1.6 0.7 1.6-0.7 0.7-1.6zM27.1 18.3q0 0.9-0.7 1.6l-8.8 8.8q-0.7 0.7-1.6 0.7-0.9 0-1.6-0.7l-12.8-12.8q-0.7-0.7-1.2-1.8t-0.5-2.1v-7.4q0-0.9 0.7-1.6t1.6-0.7h7.4q0.9 0 2.1 0.5t1.8 1.2l12.8 12.8q0.7 0.7 0.7 1.6z"></path>
						</svg>
					</span>
					<?php foreach( $page->tags(true) as $tagKey=>$tagName): ?>
					<span class="entry-terms post_tag">
						<a href="<?php echo DOMAIN_TAGS.$tagKey ?>" rel="tag">
							<?php echo $tagName ?>
						</a>
					</span>
					<?php endforeach; ?>
				</div>
				<?php endif; ?>
			</footer>
			<?php
            $prevKey = $helper->previousKey();
            $nextKey = $helper->nextKey();
            if( $prevKey || $nextKey):
            ?>
			<nav class="navigation post-navigation" role="navigation">
				<h2 class="screen-reader-text"><?php echo $L->get('Post navigation'); ?></h2>
				<div class="nav-links">
					<?php
                if($prevKey):
                    $prevPage = new Page($prevKey);
                    ?>
					<div class="nav-previous">
						<a href="<?php echo  $prevPage->permalink() ?>" rel="prev">
							<span class="meta-nav" aria-hidden="true">
								<svg class="icon icon-arrow-circle-left" aria-hidden="true" role="img" viewBox="0 0 27 32">
									<path d="M23 17v-2q0 0 0-1t-1 0h-9l3-3q0 0 0-1t0-1l-2-2q0 0-1 0t-1 0l-8 8q0 0 0 1t0 1l8 8q0 0 1 0t1 0l2-2q0 0 0-1t0-1l-3-3h9q0 0 1 0t0-1zM27 16q0 4-2 7t-5 5-7 2-7-2-5-5-2-7 2-7 5-5 7-2 7 2 5 5 2 7z"></path>
								</svg><?php echo $L->get('Previous'); ?>
							</span>
							<span class="screen-reader-text"><?php echo $L->get('Previous post:'); ?></span>
							<span class="post-title">
								<?php echo  $prevPage->title() ?>
							</span>
						</a>
					</div>
					<?php endif?>

					<?php
                if($nextKey):
                    $nextPage =  new Page($nextKey);

                    ?>
					<div class="nav-next">
						<a href="<?php echo $nextPage->permalink() ?>" rel="next">
							<span class="meta-nav" aria-hidden="true">
								<?php echo $L->get('Next'); ?>
								<svg class="icon icon-arrow-circle-right" aria-hidden="true" role="img" viewBox="0 0 27 32">
									<path d="M23 16q0 0 0-1l-8-8q0 0-1 0t-1 0l-2 2q0 0 0 1t0 1l3 3h-9q0 0-1 0t0 1v2q0 0 0 1t1 0h9l-3 3q0 0 0 1t0 1l2 2q0 0 1 0t1 0l8-8q0 0 0-1zM27 16q0 4-2 7t-5 5-7 2-7-2-5-5-2-7 2-7 5-5 7-2 7 2 5 5 2 7z"></path>
								</svg>
							</span>
							<span class="screen-reader-text"><?php echo $L->get('Next post:'); ?></span>
							<span class="post-title">
								<?php echo $nextPage->title() ?>
							</span>
						</a>
					</div>
					<?php endif?>
				</div>
			</nav>
			<?php endif?>
			<?php			
			if($related = $helper->getRelated()):?>
			<div class="related-items">
				<h3><?php echo $L->get('Related posts'); ?></h3>
				<?php foreach($related as $relpage): ?>
				<div class="rel-item">
					<a href="<?php echo $relpage->permalink(); ?>"></a>
					<?php if($relpage->thumbCoverImage()): ?>
					<div class="rel-item__icon">
						<img src="<?php echo $helper->cdn_cover_image( $relpage->thumbCoverImage(),60,60); ?>" />
					</div>					
					<?php endif ?>
					<div class="rel-item__title">
						<?php echo $relpage->title() ?>
					</div>
				</div>
				<?php endforeach;?>
			</div>
			<?php endif; ?>
			<div class="entry-footer">
				<?php Theme::plugins('pageEnd'); ?>
			</div>
		</article>
	</main>
</div>
