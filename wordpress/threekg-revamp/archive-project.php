<?php get_header(); ?>
<main class="work project-archive" id="main">
  <div class="section-head"><span class="mono">[projects]</span><h1>Selected<br><em>work.</em></h1></div>
  <div class="work__editorial">
    <?php $i = 0; while (have_posts()) : the_post();
      $client = threekg_project_meta(get_the_ID(), '_3kg_project_client', get_the_title());
      $image = get_the_post_thumbnail_url(get_the_ID(), 'full') ?: threekg_fallback_image($i);
      $terms = get_the_terms(get_the_ID(), 'project_sector');
      $tag = ($terms && !is_wp_error($terms)) ? $terms[0]->name : get_the_excerpt(); ?>
      <a class="work-block <?php echo esc_attr(threekg_archive_columns($i)); ?> reveal" href="<?php the_permalink(); ?>">
        <span class="work-block__media"><img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($client); ?>"></span>
        <span class="work-block__caption"><span class="work-block__title"><?php echo esc_html($client); ?></span><span class="work-block__tag mono"><?php echo esc_html($tag); ?></span></span>
      </a>
    <?php $i++; endwhile; ?>
  </div>
</main>
<?php get_footer(); ?>

