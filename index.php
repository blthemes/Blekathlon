<!DOCTYPE html>
<html>
<head>
    <?php include(THEME_DIR_PHP.'head.php'); ?>
</head>
<body>
	<?php Theme::plugins('siteBodyBegin'); ?>
    <?php include(THEME_DIR_PHP.'header.php'); ?>

    <?php
    if ($WHERE_AM_I == 'page') {
        include(THEME_DIR_PHP.'page.php');
    } else {
        include(THEME_DIR_PHP.'home.php');
    }
    ?>

    <?php include(THEME_DIR_PHP.'aside.php'); ?>

    <?php include(THEME_DIR_PHP.'footer.php'); ?>

    <?php echo Theme::javascript('js/bundle.min.js'); ?>    

    <?php Theme::plugins('siteBodyEnd'); ?>

</body>
</html>
