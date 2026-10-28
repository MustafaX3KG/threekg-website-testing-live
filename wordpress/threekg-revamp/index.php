<?php get_header(); ?>
<main class="wp-content-shell" id="main">
  <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
    <article <?php post_class('wp-content-page'); ?>>
      <header><h1><?php the_title(); ?></h1></header>
      <div class="entry-content"><?php the_content(); ?></div>
    </article>
  <?php endwhile; else : ?>
    <p><?php esc_html_e('Nothing found.', 'threekg-revamp'); ?></p>
  <?php endif; ?>
</main>
<?php get_footer(); ?>

