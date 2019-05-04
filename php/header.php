
<header class="site-header main-padding">
	<input class="search-toggle" type="checkbox" id="search-toggle" />
	<div class="wrapper main-width search-header">
		<div class="site-branding">
			<div class="site-title title-font no-margin-bottom">
				<a class="navbar-brand" href="<?php echo $site->url(); ?>" rel="home">
					<?php if( method_exists($site, 'logo') &&  $site->logo() ):?>
						<img class="site-logo" src="<?php echo $helper->cdn_that_image($site->logo(),130); ?>" alt="<?php echo $site->title()?>" />
					<?php else: ?>
						<span class="text-white">
							<?php echo $site->title(); ?>
						</span>
						<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 16 16">
							<path d="M4.1 8c0 2.1 1.7 3.9 3.9 3.9 2.1 0 3.9-1.7 3.9-3.9 0-2.1-1.7-3.9-3.9-3.9 -2.1 0-3.9 1.7-3.9 3.9Z" fill="#ff1654"></path>
							<path d="M1.6 8.7c0.3 3 2.7 5.3 5.6 5.6l0 1.5c-3.8-0.3-6.8-3.3-7.1-7.1l1.5 0Zm14.2 0c-0.3 3.8-3.3 6.8-7.1 7.1l0-1.5c3-0.3 5.3-2.7 5.6-5.6l1.5 0Zm-7.1-7.1c3 0.3 5.3 2.7 5.6 5.6l1.5 0c-0.3-3.8-3.3-6.8-7.1-7.1l0 1.5Zm-7.1 5.6c0.3-3 2.7-5.3 5.6-5.6l0-1.5c-3.8 0.3-6.8 3.3-7.1 7.1l1.5 0Z"></path>
						</svg>
					<?php endif; ?>				
				</a>
			</div>
		</div>
		<div class="main-navigation-wrapper" id="main-navigation-wrapper">
			<nav id="site-navigation" class="main-navigation" role="navigation">
				<ul class="primary-menu">
					<?php if($site->homepage()):?>
					<li class="nav-item">
						<a class="nav-link" href="<?php echo DOMAIN_BASE.$url->filters('blog').'/'; ?>">
							<?php echo $L->get('Blog'); ?>
						</a>
					</li>
					<?php endif;?>

					<?php foreach ($categories->db as $key=>$fields):
                              if($fields['list']):  ?>
					<li class="nav-item">
						<a class="nav-link" href="<?php echo DOMAIN_CATEGORIES.$key; ?>">
							<?php echo $fields['name']; ?>
						</a>
					</li>
					<?php
                              endif;
                          endforeach; ?>
				</ul>				
			     <?php Theme::plugins('siteSidebar') ?>              
           
			</nav>
		</div>

		<label class="search-header-nav-button" for="search-toggle">
			<svg class="svg-search" viewBox="0 0 32 32" stroke-width="2">
				<circle cx="14" cy="14" r="12"></circle>
				<path d="M23 23 L30 30"></path>
			</svg>
		</label>

		<button class="menu-toggle" id="menu-toggle" type="button" aria-controls="primary-menu" aria-expanded="false">
			<span class="menu-toggle-svg-wrapper" id="menu-toggle-svg-wrapper">
				<svg class="icon icon-menu-toggle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
					<g class="svg-menu-toggle">
						<path class="bar line-1" d="M5 13h90v14H5z"></path>
						<path class="bar line-2" d="M5 43h90v14H5z"></path>
						<path class="bar line-3" d="M5 73h90v14H5z"></path>
					</g>
				</svg>
			</span>
			<span class="menu-toggle-text screen-reader-text" id="menu-toggle-text">
				<?php echo $L->get('Menu'); ?>
			</span>
		</button>

		<div class="search-wrapper">
			<label class="search-overlay" for="search-toggle"></label>
			<div class="search-inner" role="search">
				<div class="search-form" name="search">
					<label class="search-icon" for="search-toggle">
						<svg viewBox="0 0 32 32" width="24" height="24" fill="none" stroke="currentcolor" stroke-width="2">
							<path d="M10 6 L2 16 10 26 M2 16 L30 16"></path>
						</svg>
					</label>

					<input type="text" class="search-input" name="query" placeholder="<?php echo $L->get('Search');?>" autocorrect="off" autocomplete="off" spellcheck="false" />

					<div class="search-icon reset-search" tabindex="-1">
						<svg viewBox="0 0 32 32" width="24" height="24" fill="none" stroke="currentcolor" stroke-width="2">
							<path d="M2 30 L30 2 M30 30 L2 2"></path>
						</svg>
					</div>
				</div>
				<div class="search-output">
					<div class="search-scrollwrap" data-scrollfix="">
						<div class="search-result" data-component="result">
							<div class="search-result-meta">
								<?php echo $L->get('Type to start searching') . PHP_EOL ?>
								<script>
									var translations ={
									  "type-to-start-searching": "<?php echo $L->get('Type to start searching')?>",
								    };
								</script>
							</div>
							<ol class="search-result-list"></ol>
						</div>
					</div>
				</div>
			</div>

		</div>

	</div>
</header>
<svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg">
	<defs>
		<symbol id="icon-pencil" viewBox="0 0 27 32">
			<path d="M6.5 27.4l1.6-1.6-4.2-4.2-1.6 1.6v1.9h2.3v2.3h1.9zM15.8 10.9q0-0.4-0.4-0.4-0.2 0-0.3 0.1l-9.7 9.7q-0.1 0.1-0.1 0.3 0 0.4 0.4 0.4 0.2 0 0.3-0.1l9.7-9.7q0.1-0.1 0.1-0.3zM14.9 7.4l7.4 7.4-14.9 14.9h-7.4v-7.4zM27.1 9.1q0 0.9-0.7 1.6l-3 3-7.4-7.4 3-2.9q0.6-0.7 1.6-0.7 0.9 0 1.6 0.7l4.2 4.2q0.7 0.7 0.7 1.6z"></path>
		</symbol>
		<symbol id="icon-twitter" viewBox="0 0 32 32">
			<path d="M31.6 5.4c-1.1 0.8-2.4 1.2-3.7 1.2 1.4-0.9 2.5-2.3 3-3.9 -1.2 1-2.7 1.6-4.2 1.7 -1.3-1.3-3-2.1-4.8-2.1 -3.7 0-6.7 3.2-6.7 7 0 0.5 0 1 0.1 1.4 -5.3-0.3-10.2-2.9-13.5-7.2 -1.7 3.1-0.8 7.1 2 9.1 -1 0-2-0.2-3-0.7 0.1 3.2 2.2 6 5.2 6.7 -1 0.3-2 0.3-3 0.1 0.9 2.8 3.4 4.8 6.2 4.9 -2.9 1.9-6.3 2.8-9.8 2.8 3 2.1 6.6 3.2 10.2 3.2 10.2 0 18.6-8.8 18.6-19.5 0-0.4 0-0.7 0-1.1 1.2-1 2.3-2.3 3.3-3.6"></path>
		</symbol>
		<symbol id="icon-github" viewBox="0 0 32 32">
			<path d="M22.1 28.4c1 0 0.8 1.1 0.8 1.1l-12.6 0c0 0-0.1-1.1 0.8-1.1 0.9 0 1.1-0.4 1.1-0.8l-0.1-3.4c-4.9 1.1-6-1.9-6-1.9 -0.8-2-1.9-2.5-1.9-2.5 -1.7-1.1 0.1-1.1 0.1-1.1 1.8 0.1 2.8 1.8 2.8 1.8 1.5 2.6 4.1 1.9 5.1 1.5 0.1-1.1 0.6-1.9 1.1-2.4 -3.9-0.4-8-1.9-8-8.5 0-1.9 0.7-3.4 1.8-4.7 -0.2-0.4-0.8-2.2 0.2-4.5 0 0 1.5-0.5 4.8 1.8 2.9-0.8 6-0.8 8.9 0 3.4-2.2 4.8-1.8 4.8-1.8 1 2.4 0.4 4.1 0.2 4.5 1.1 1.2 1.8 2.8 1.8 4.7 0 6.6-4.2 8.1-8.1 8.5 0.7 0.5 1.2 1.6 1.2 3.2l-0.1 4.7c0 0.4 0.2 0.8 1.1 0.8Z"></path>
		</symbol>
		<symbol id="icon-facebook" viewBox="0 0 32 32">
			<path d="M17.5 31.6l0-14.2 4.5 0 0.6-5.5 -5.2 0 0-3.5c0-1.6 0.4-2.7 2.6-2.7l2.8 0 0-4.9c-0.5-0.1-2.1-0.2-4-0.2 -4 0-6.7 2.5-6.7 7.3l0 4 -4.5 0 0 5.5 4.5 0 0 14.2 5.4 0Z"></path>
		</symbol>		
		<symbol id="icon-codepen" viewBox="0 0 32 32">
			<path d="M32 11l0 0 0 0c0 0 0 0 0 0 0 0 0 0 0 0l0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -15-10c0 0-1 0-2 0l-15 10 0 0 0 0 0 0 0 0 0 0 0 0 0 0c0 0 0 0 0 0l0 0 0 0c0 0 0 0 0 0l0 0c0 0 0 0 0 0l0 10c0 0 0 0 0 0l0 0c0 0 0 0 0 0l0 0c0 0 0 0 0 0l0 0c0 0 0 0 0 0l0 0c0 0 0 0 0 0l0 0 0 0c0 0 0 0 0 0l0 0 0 0 0 0 15 10c0 0 1 0 1 0 0 0 1 0 1 0l15-10 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0-10c0 0 0 0 0 0l0 0 0 0 0 0Zm-16 8l-5-3 5-3 5 3 -5 3 0 0Zm-1-9l-6 4 -5-3 11-7 0 6 0 0Zm-8 6l-3 2 0-5 3 2 0 0Zm2 2l6 4 0 6 -11-7 5-3 0 0 0 0Zm9 4l6-4 5 3 -11 7 0-6 0 0Zm8-6l3-2 0 5 -3-2 0 0Zm-2-2l-6-4 0-6 11 7 -5 3 0 0Z"></path>
		</symbol>
		<symbol id="icon-linkedin" viewBox="0 0 32 32">
			<path d="M17.7 30.5l-5.9 0 0-19.2 5.7 0 0 2.6 0.1 0c0.8-1.5 2.7-3.1 5.6-3.1 6 0 7.1 4 7.1 9.1l0 10.5 0 0 -5.9 0 0-9.3c0-2.2 0-5.1-3.1-5.1 -3.1 0-3.5 2.4-3.5 4.9l0 9.5Zm-9.6 0l-5.9 0 0-19.2 5.9 0 0 19.2Zm-3-21.8c-1.9 0-3.4-1.6-3.4-3.5 0-1.9 1.5-3.5 3.4-3.5 1.9 0 3.4 1.6 3.4 3.5 0 1.9-1.5 3.5-3.4 3.5Z"></path>
		</symbol>
		<symbol id="icon-instagram" viewBox="0 0 32 32">
			<path d="M23 1.1c4.3 0 7.8 3.5 7.8 7.8l0 14c0 4.3-3.5 7.8-7.8 7.8l-14 0c-4.3 0-7.8-3.5-7.8-7.8l0-14c0-4.3 3.5-7.8 7.8-7.8l14 0Zm-7 7.9c3.8 0 6.9 3.1 6.9 6.9 0 3.8-3.1 6.9-6.9 6.9 -3.8 0-6.9-3.1-6.9-6.9 0-3.8 3.1-6.9 6.9-6.9Zm8.7-3.7c1.1 0 1.9 0.9 1.9 1.9 0 1.1-0.9 1.9-1.9 1.9 -1.1 0-1.9-0.9-1.9-1.9 0-1 0.9-1.9 1.9-1.9Z"></path>
		</symbol>
	</defs>
</svg>
<script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@type": "WebSite",
      "name": "<?php echo $site->title(); ?>",
      "alternateName": "<?php echo $site->description(); ?>",
      "url": "<?php echo $site->url(); ?>"
    }
</script>
