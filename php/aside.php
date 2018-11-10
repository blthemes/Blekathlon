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
                        <?php foreach ($staticContent as $staticPage) : ?>
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
                        <?php if ($site->github()) : ?>
                        <li class="menu-item">
                            <a class="nav-link" href="<?php echo $site->github() ?>" target="_blank">
                                <span class="screen-reader-text">Github</span>
                                <svg class="icon icon-github" aria-hidden="true" role="img">
                                    <use xlink:href="#icon-github"></use>
                                </svg>
                            </a>
                        </li>
                        <?php endif ?>

                        <?php if ($site->twitter()) : ?>
                        <li class="menu-item">
                            <a class="nav-link" href="<?php echo $site->twitter() ?>" target="_blank">
                                <span class="screen-reader-text">Twitter</span>
                                <svg class="icon icon-twitter" aria-hidden="true" role="img">
                                    <use xlink:href="#icon-twitter"></use>
                                </svg>
                            </a>
                        </li>
                        <?php endif ?>

                        <?php if ($site->facebook()) : ?>
                        <li class="menu-item">
                            <a class="nav-link" href="<?php echo $site->facebook() ?>" target="_blank">
                                <span class="screen-reader-text">Facebook</span>
                                <svg class="icon icon-facebook" aria-hidden="true" role="img">
                                    <use xlink:href="#icon-facebook"></use>
                                </svg>
                            </a>
                        </li>
                        <?php endif ?>

                        <?php if ($site->googleplus()) : ?>
                        <li class="menu-item">
                            <a class="nav-link" href="<?php echo $site->googleplus() ?>" target="_blank">
                                <span class="screen-reader-text">Google +</span>
                                <svg class="icon icon-googleplus" aria-hidden="true" role="img">
                                    <use xlink:href="#icon-googleplus"></use>
                                </svg>
                            </a>
                        </li>
                        <?php endif ?>

                        <?php if ($site->codepen()) : ?>
                        <li class="menu-item">
                            <a class="nav-link" href="<?php echo $site->codepen() ?>" target="_blank">
                                <span class="screen-reader-text">Codepen</span>
                                <svg class="icon icon-codepen" aria-hidden="true" role="img">
                                    <use xlink:href="#icon-codepen"></use>
                                </svg>
                            </a>
                        </li>
                        <?php endif ?>

                        <?php if ($site->linkedin()) : ?>
                        <li class="menu-item">
                            <a class="nav-link" href="<?php echo $site->linkedin() ?>" target="_blank">
                                <span class="screen-reader-text">LinkedIn</span>
                                <svg class="icon icon-linkedin" aria-hidden="true" role="img">
                                    <use xlink:href="#icon-linkedin"></use>
                                </svg>
                            </a>
                        </li>
                        <?php endif ?>

						<?php if ($site->instagram()) : ?>
                        <li class="menu-item">
                            <a class="nav-link" href="<?php echo $site->instagram() ?>" target="_blank">
                                <span class="screen-reader-text">Instagram</span>
                                <svg class="icon icon-instagram" aria-hidden="true" role="img">
                                    <use xlink:href="#icon-instagram"></use>
                                </svg>
                            </a>
                        </li>
                        <?php endif ?>
                    </ul>
                </div>
            </nav>
        </div>
    </div>
</aside>