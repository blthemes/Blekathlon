<aside class="footer-widgets-wrapper footer-widgets main-padding" role="complementary">
    <div class="wrapper main-width">
        <div class="grid-wrapper">
            <div>
                <p class="site-title site-title-footer no-margin-bottom title-font">
                    <?php echo $site->title() ?>
                </p>
                <p class="site-description site-description-footer">
                    <?php echo $site->description() ?>
                </p>
            </div>
            <div class="footer-widget-area">
                <section class="widget widget_nav_menu">
                    <h3><?php echo $L->get('Latest posts'); ?></h3>
                    <ul class="menu">
                        <?php

                        $listOfKeys = $pages->getList(1, 4);

                        if ($listOfKeys) :
                            foreach ($listOfKeys as $key) :
                            $lPage = new Page($key);
                        ?>
                        <li class="menu-item">
                            <a href="<?php echo $lPage->permalink() ?>">
                                <?php echo $lPage->title() ?>
                            </a>
                        </li>
                        <?php endforeach ?>
                        <?php endif ?>
                    </ul>
                </section>
            </div>

            <div class="footer-widget-area">
                <section class="widget widget_nav_menu">
					<h3><?php echo $L->get('Pages'); ?></h3>
                    <ul class="menu">
                        <?php foreach ($staticContent as $staticPage) :
						 if(Text::stringContains($staticPage->key(),'404')) continue;
						?>
                        <li class="menu-item">
                            <a href="<?php echo $staticPage->permalink(); ?>">
                                <?php echo $staticPage->title(); ?>
                            </a>
                        </li>
                        <?php endforeach ?>
                    </ul>
                </section>
            </div>

            <nav class="menu-social social-navigation menu clear" role="navigation" aria-label="Social Menu">
                <div class="social-menu-wrapper clear">
                    <ul class="menu-social-items">
                        <!-- Social Networks -->
						<?php foreach (Theme::socialNetworks() as $key=>$label): ?>
                        <li class="menu-item">
							<a class="<?php echo $key?> nav-link" href="<?php echo $site->{$key}(); ?>" target="_blank" rel="nofollow noreferrer">
							    <span class="screen-reader-text"><?php echo $label; ?></span>
								 <svg class="icon icon-<?php echo $key?>" aria-hidden="true" role="img">
                                    <use xlink:href="#icon-<?php echo $key?>"></use>
                                </svg>								
                            </a>
                        </li>
						<?php endforeach; ?>    
                    </ul>
                </div>
            </nav>
        </div>
    </div>
</aside>