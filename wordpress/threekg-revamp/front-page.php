<?php
get_header();
while (have_posts()) :
    the_post();
    // An existing Elementor page keeps its saved content. An empty page can use
    // the profile-aligned homepage without copying HTML into the database.
    if (trim(get_the_content()) !== '' || get_post_meta(get_the_ID(), '_elementor_edit_mode', true) === 'builder') {
        the_content();
    } else {
        get_template_part('template-parts/profile-home');
    }
endwhile;
get_footer();
