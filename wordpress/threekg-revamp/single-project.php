<?php get_header(); while (have_posts()) : the_post();
  $client = threekg_project_meta(get_the_ID(), '_3kg_project_client', get_the_title());
  $portfolio_title = threekg_project_meta(get_the_ID(), '_3kg_project_portfolio_title', get_the_title());
  $year = threekg_project_meta(get_the_ID(), '_3kg_project_year', get_the_date('Y'));
  $image = get_the_post_thumbnail_url(get_the_ID(), 'full'); ?>
<main class="project-single" id="main">
  <header class="project-hero">
    <div class="mono project-hero__meta"><span><?php echo esc_html($client); ?></span><span><?php echo esc_html($year); ?></span></div>
    <h1><?php echo esc_html($portfolio_title); ?></h1>
    <?php if ($image) : ?><img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($client); ?>"><?php endif; ?>
  </header>
  <article class="project-content entry-content"><?php the_content(); ?></article>
  <nav class="project-nav"><?php previous_post_link('%link', '← %title'); ?><?php next_post_link('%link', '%title →'); ?></nav>
</main>
<?php endwhile; get_footer(); ?>
