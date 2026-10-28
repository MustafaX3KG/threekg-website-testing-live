<?php
get_header();
while (have_posts()) :
    the_post();
    if (did_action('elementor/loaded') && \Elementor\Plugin::$instance->db->is_built_with_elementor(get_the_ID())) {
        the_content();
    } else {
        ?>
        <main class="wp-content-shell" id="main">
          <article <?php post_class('wp-content-page'); ?>>
            <header><span class="mono">(page)</span><h1><?php the_title(); ?></h1></header>
            <div class="entry-content"><?php the_content(); ?></div>
          </article>
        </main>
        <?php
    }
endwhile;
get_footer();

