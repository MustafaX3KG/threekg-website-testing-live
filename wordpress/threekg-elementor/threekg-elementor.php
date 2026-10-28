<?php
/**
 * Plugin Name: ThreeKG Elementor Sections
 * Description: Editable Elementor sections for the ThreeKG studio website.
 * Version: 1.2.0
 * Author: ThreeKG
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('elementor/elements/categories_registered', function ($manager) {
    $manager->add_category('threekg', array(
        'title' => __('ThreeKG Sections', 'threekg-elementor'),
        'icon'  => 'eicon-site-identity',
    ));
});

add_action('elementor/widgets/register', function ($widgets_manager) {
    if (!class_exists('Elementor\\Widget_Base')) {
        return;
    }

    abstract class ThreeKG_Widget_Base extends \Elementor\Widget_Base {
        public function get_categories() { return array('threekg'); }
        public function get_icon() { return 'eicon-site-identity'; }
        public function get_style_depends() { return array('threekg-revamp'); }
        public function get_script_depends() { return array('threekg-revamp'); }

        protected function text_control($id, $label, $default = '', $type = null) {
            $this->add_control($id, array(
                'label' => $label,
                'type' => $type ?: \Elementor\Controls_Manager::TEXT,
                'default' => $default,
                'label_block' => true,
            ));
        }
    }

    class ThreeKG_Hero_Widget extends ThreeKG_Widget_Base {
        public function get_name() { return 'threekg_hero'; }
        public function get_title() { return __('3KG — Header & Hero', 'threekg-elementor'); }
        protected function register_controls() {
            $this->start_controls_section('content', array('label' => __('Content', 'threekg-elementor')));
            $this->text_control('brand', __('Brand', 'threekg-elementor'), '3KG');
            $this->text_control('availability', __('Availability label', 'threekg-elementor'), 'Cairo, Egypt');
            $this->text_control('kicker', __('Intro label', 'threekg-elementor'), '(3KG — Cairo, Egypt)');
            $this->text_control('line_1', __('Headline line 1', 'threekg-elementor'), 'Strategy first.');
            $this->text_control('line_2', __('Headline line 2', 'threekg-elementor'), 'Impact always.');
            $this->text_control('line_3', __('Headline line 3', 'threekg-elementor'), '');
            $this->text_control('accent', __('Italic accent', 'threekg-elementor'), '');
            $this->text_control('email', __('Email', 'threekg-elementor'), '');
            $this->add_control('loader_video', array(
                'label' => __('Loader video', 'threekg-elementor'),
                'type' => \Elementor\Controls_Manager::MEDIA,
                'media_types' => array('video'),
            ));
            $this->add_control('background_image', array(
                'label' => __('Optional hero background image', 'threekg-elementor'),
                'type' => \Elementor\Controls_Manager::MEDIA,
            ));
            $this->end_controls_section();
        }
        protected function render() {
            $s = $this->get_settings_for_display();
            $theme = get_template_directory_uri();
            $loader_video = !empty($s['loader_video']['url']) ? $s['loader_video']['url'] : $theme . '/assets/brand/motion/loader.mp4';
            $hero_style = !empty($s['background_image']['url']) ? 'background-image:url(' . esc_url($s['background_image']['url']) . ');background-size:cover;background-position:center;' : '';
            ?>
            <div class="loader" id="loader" aria-hidden="true"><video class="loader__video" id="loaderVideo" src="<?php echo esc_url($loader_video); ?>" autoplay muted playsinline></video><span class="mono loader__skip">click to skip</span></div>
            <div class="cursor" aria-hidden="true"></div>
            <div class="menu" id="menu" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Navigation" inert><button type="button" class="menu__close mono" aria-label="Close navigation">close ×</button><div class="menu__inner"><span class="mono menu__cap">(navigation)</span><nav class="menu__nav">
              <a href="#top"><span class="mono">01</span> Index</a><a href="#showreel"><span class="mono">02</span> Showreel</a><a href="#work"><span class="mono">03</span> Work</a><a href="#clients"><span class="mono">04</span> Clients</a><a href="#studio"><span class="mono">05</span> Studio</a><a href="#contact"><span class="mono">06</span> Contact</a>
            </nav><div class="menu__foot"><a href="<?php echo esc_url(is_email($s['email']) ? 'mailto:' . $s['email'] : 'https://threekg.com'); ?>"><?php echo esc_html($s['email'] ?: 'threekg.com'); ?></a></div></div></div>
            <header class="site-header"><a class="brand" href="#top"><?php echo esc_html($s['brand']); ?><span class="brand__reg">®</span></a><div class="mono site-header__meta"><span class="avail"><i class="avail__dot"></i><?php echo esc_html($s['availability']); ?></span><span class="hide-sm">Brand · Design · Campaigns · Production · Tech · Xperience</span><span id="clock">--:--:--</span><span id="tz"></span></div><button class="menu-toggle mono" id="menuToggle" aria-controls="menu" aria-expanded="false">menu</button></header>
            <section class="hero" id="top" style="<?php echo esc_attr($hero_style); ?>"><canvas class="hero__canvas" id="field" aria-hidden="true"></canvas><div class="hero__inner"><p class="mono hero__kicker reveal"><?php echo esc_html($s['kicker']); ?></p><h1 class="hero__title"><span class="reveal"><?php echo esc_html($s['line_1']); ?></span><span class="reveal"><?php echo esc_html($s['line_2']); ?></span><span class="reveal hero__title--soft"><?php echo esc_html($s['line_3']); ?><em>&nbsp;<?php echo esc_html($s['accent']); ?></em></span></h1><div class="hero__foot"><span class="mono">scroll to explore ↓</span><span class="mono hide-sm">working worldwide</span><span class="mono hide-sm">[01/07]</span></div></div></section>
            <?php
        }
    }

    class ThreeKG_Showreel_Widget extends ThreeKG_Widget_Base {
        public function get_name() { return 'threekg_showreel'; }
        public function get_title() { return __('3KG — Showreel', 'threekg-elementor'); }
        protected function register_controls() {
            $this->start_controls_section('content', array('label' => __('Showreel', 'threekg-elementor')));
            $this->add_control('video', array('label' => __('Video', 'threekg-elementor'), 'type' => \Elementor\Controls_Manager::MEDIA, 'media_types' => array('video')));
            $this->text_control('year', __('Year', 'threekg-elementor'), '2026');
            $this->text_control('duration', __('Duration label', 'threekg-elementor'), 'the 3KG symbol system');
            $this->text_control('marquee', __('Marquee items (separate with |)', 'threekg-elementor'), 'Brand|Design|Campaigns|Production|Tech|Xperience');
            $this->end_controls_section();
        }
        protected function render() {
            $s = $this->get_settings_for_display();
            $video = !empty($s['video']['url']) ? $s['video']['url'] : get_template_directory_uri() . '/assets/brand/motion/loader.mp4';
            $items = array_filter(array_map('trim', explode('|', $s['marquee'])));
            ?>
            <section class="showreel" id="showreel"><div class="showreel__frame reveal" tabindex="0" role="button"><video class="showreel__video" id="showreelVideo" src="<?php echo esc_url($video); ?>" muted loop playsinline preload="metadata"></video><div class="showreel__scrim"></div><div class="showreel__overlay"><span class="mono showreel__cap">[02 — showreel] <?php echo esc_html($s['year']); ?></span><button class="showreel__play" id="showreelPlay"><span class="showreel__play-icon">▶</span><span class="mono">play reel</span></button><span class="mono showreel__dur hide-sm"><?php echo esc_html($s['duration']); ?></span></div></div></section>
            <section class="marquee" aria-hidden="true"><div class="marquee__track"><?php for ($set = 0; $set < 2; $set++) : ?><span class="marquee__set"><?php foreach ($items as $item) : ?><span><?php echo esc_html($item); ?></span><i>✳</i><?php endforeach; ?></span><?php endfor; ?></div></section>
            <?php
        }
    }

    class ThreeKG_Work_Widget extends ThreeKG_Widget_Base {
        public function get_name() { return 'threekg_work'; }
        public function get_title() { return __('3KG — Projects', 'threekg-elementor'); }
        protected function register_controls() {
            $this->start_controls_section('content', array('label' => __('Projects section', 'threekg-elementor')));
            $this->text_control('eyebrow', __('Section label', 'threekg-elementor'), '[03 — featured]');
            $this->text_control('title', __('Title', 'threekg-elementor'), 'Featured work.');
            $this->add_control('source', array(
                'label' => __('Project source', 'threekg-elementor'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => 'manual',
                'options' => array('manual' => __('Edit here in Elementor', 'threekg-elementor'), 'cms' => __('WordPress Projects CMS', 'threekg-elementor')),
            ));
            $this->add_control('count', array('label' => __('CMS project count', 'threekg-elementor'), 'type' => \Elementor\Controls_Manager::NUMBER, 'default' => 6, 'min' => 1, 'max' => 12, 'condition' => array('source' => 'cms')));

            $repeater = new \Elementor\Repeater();
            $repeater->add_control('image', array('label' => __('Project image', 'threekg-elementor'), 'type' => \Elementor\Controls_Manager::MEDIA));
            $repeater->add_control('name', array('label' => __('Project name', 'threekg-elementor'), 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'Project name', 'label_block' => true));
            $repeater->add_control('tag', array('label' => __('Project type', 'threekg-elementor'), 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'brand identity'));
            $repeater->add_control('link', array('label' => __('Project link', 'threekg-elementor'), 'type' => \Elementor\Controls_Manager::URL, 'placeholder' => 'https://'));
            $repeater->add_control('layout', array('label' => __('Image layout', 'threekg-elementor'), 'type' => \Elementor\Controls_Manager::SELECT, 'default' => 'full', 'options' => array('full' => 'Full width', 'right' => 'Right aligned', 'left' => 'Left aligned', 'side' => 'Small side')));
            $names = array('SRNTY','Vodafone Egypt','Tasaheel','Americana Recipes','Americana Foodservice','Americana QSR');
            $tags = array('Brand','Design','Campaigns','Production','Tech','Xperience');
            $images = array('srnty-goldenhour.webp','vf-p14.webp','tasaheel-foodtruck.webp','zinger_04.webp','afs-1.webp','mcd-diorama.webp');
            $layouts = array('full','right','left','side','full','right');
            $defaults = array();
            foreach ($names as $i => $name) {
                $defaults[] = array('name' => $name, 'tag' => $tags[$i], 'layout' => $layouts[$i], 'image' => array('url' => get_template_directory_uri() . '/assets/profile/' . $images[$i]));
            }
            $this->add_control('manual_projects', array(
                'label' => __('Projects', 'threekg-elementor'),
                'type' => \Elementor\Controls_Manager::REPEATER,
                'fields' => $repeater->get_controls(),
                'default' => $defaults,
                'title_field' => '{{{ name }}}',
                'condition' => array('source' => 'manual'),
            ));
            $this->end_controls_section();
        }
        protected function render() {
            $s = $this->get_settings_for_display();
            $title = preg_split('/\s+/', trim($s['title']), 2);
            ?>
            <section class="work" id="work"><div class="section-head reveal"><span class="mono"><?php echo esc_html($s['eyebrow']); ?></span><span class="mono">Selected projects</span><div class="work__titlerow"><h2><?php echo esc_html($title[0]); ?><br><em><?php echo esc_html($title[1] ?? 'work.'); ?></em></h2><button type="button" class="symbol-btn work__symbol" data-category="selected-work"><svg viewBox="-145 -145 290 290" aria-hidden="true"></svg></button></div></div><div class="work__editorial">
            <?php if (($s['source'] ?? 'manual') === 'cms') :
                $q = new WP_Query(array('post_type' => 'project', 'post_status' => 'publish', 'posts_per_page' => (int) $s['count'], 'orderby' => array('menu_order' => 'ASC', 'date' => 'DESC')));
                $i = 0;
                while ($q->have_posts()) : $q->the_post();
                    $id = get_the_ID(); $client = get_post_meta($id, '_3kg_project_client', true) ?: get_the_title(); $image = get_the_post_thumbnail_url($id, 'full') ?: threekg_fallback_image($i); $terms = get_the_terms($id, 'project_sector'); $tag = ($terms && !is_wp_error($terms)) ? $terms[0]->name : get_the_excerpt(); ?>
                  <a class="work-block <?php echo esc_attr(threekg_archive_columns($i)); ?> reveal" href="<?php the_permalink(); ?>"><span class="work-block__media"><img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($client); ?>"></span><span class="work-block__caption"><span class="work-block__title"><?php echo esc_html($client); ?></span><span class="work-block__tag mono"><?php echo esc_html($tag); ?></span></span></a>
                <?php $i++; endwhile; wp_reset_postdata();
            else : foreach (($s['manual_projects'] ?? array()) as $i => $project) :
                $image = !empty($project['image']['url']) ? $project['image']['url'] : threekg_fallback_image($i);
                $href = !empty($project['link']['url']) ? $project['link']['url'] : '#';
                $layout = in_array($project['layout'] ?? '', array('full','right','left','side'), true) ? $project['layout'] : 'full'; ?>
              <a class="work-block work-block--<?php echo esc_attr($layout); ?> reveal" href="<?php echo esc_url($href); ?>"><span class="work-block__media"><img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($project['name']); ?>"></span><span class="work-block__caption"><span class="work-block__title"><?php echo esc_html($project['name']); ?></span><span class="work-block__tag mono"><?php echo esc_html($project['tag']); ?></span></span></a>
            <?php endforeach; endif; ?>
            </div><div class="work__foot reveal"><span class="mono"><?php echo (($s['source'] ?? 'manual') === 'cms') ? 'Projects are managed from WordPress → Projects' : 'Projects are editable in Elementor'; ?></span><a class="mono" href="<?php echo esc_url(get_post_type_archive_link('project') ?: '#'); ?>">view all projects ↗</a></div></section>
            <?php
        }
    }

    class ThreeKG_Clients_Widget extends ThreeKG_Widget_Base {
        public function get_name() { return 'threekg_clients'; }
        public function get_title() { return __('3KG — Clients', 'threekg-elementor'); }
        protected function register_controls() {
            $this->start_controls_section('content', array('label' => __('Clients', 'threekg-elementor')));
            $this->text_control('title', __('Title', 'threekg-elementor'), 'Clients.');
            $repeater = new \Elementor\Repeater();
            $repeater->add_control('logo', array('label' => __('Optional logo/image', 'threekg-elementor'), 'type' => \Elementor\Controls_Manager::MEDIA));
            $repeater->add_control('name', array('label' => __('Client name', 'threekg-elementor'), 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'Client'));
            $repeater->add_control('tag', array('label' => __('Industry', 'threekg-elementor'), 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'industry'));
            $defaults = array(array('name'=>'Americana','tag'=>'Food, FMCG & Hospitality'),array('name'=>'Savola · Ganna, Rawaby','tag'=>'Food, FMCG & Hospitality'),array('name'=>'Kerma Dairy','tag'=>'Food, FMCG & Hospitality'),array('name'=>'MG Foods','tag'=>'Food, FMCG & Hospitality'),array('name'=>'Bruz','tag'=>'Food, FMCG & Hospitality'),array('name'=>'Waffy','tag'=>'Food, FMCG & Hospitality'),array('name'=>'Fasahet Somaya','tag'=>'Food, FMCG & Hospitality'),array('name'=>'Four Seasons Hotel Cairo','tag'=>'Food, FMCG & Hospitality'),array('name'=>'SRNTY Hotels','tag'=>'Food, FMCG & Hospitality'),array('name'=>'Novartis','tag'=>'Healthcare & Pharma'),array('name'=>'Abbott','tag'=>'Healthcare & Pharma'),array('name'=>'Nuxera','tag'=>'Healthcare & Pharma'),array('name'=>'Plastic Bank','tag'=>'Development & Sustainability'),array('name'=>'AFRIKA KOMMT!','tag'=>'Development & Sustainability'),array('name'=>'AMAN','tag'=>'Financial Services & Fintech'),array('name'=>'Fawry Plus','tag'=>'Financial Services & Fintech'),array('name'=>'Orient Takaful','tag'=>'Financial Services & Fintech'),array('name'=>'Tasaheel','tag'=>'Financial Services & Fintech'),array('name'=>'ALEXBANK','tag'=>'Financial Services & Fintech'),array('name'=>'KIPCO','tag'=>'Financial Services & Fintech'),array('name'=>'Vodafone Egypt','tag'=>'Technology, Telecom & Education'),array('name'=>'ALX Arabia','tag'=>'Technology, Telecom & Education'),array('name'=>'Giza Systems','tag'=>'Technology, Telecom & Education'),array('name'=>'Salasa','tag'=>'Technology, Telecom & Education'),array('name'=>'Printbox','tag'=>'Technology, Telecom & Education'),array('name'=>'CCCJ Studio','tag'=>'Technology, Telecom & Education'),array('name'=>'DLNG','tag'=>'Industry, Automotive & Real Estate'),array('name'=>'T&D Designs','tag'=>'Industry, Automotive & Real Estate'),array('name'=>'Automobilak','tag'=>'Industry, Automotive & Real Estate'),array('name'=>'Hyde Park','tag'=>'Industry, Automotive & Real Estate'),array('name'=>'Masr 360','tag'=>'Media, Culture & Lifestyle'),array('name'=>'Tatweeg News','tag'=>'Media, Culture & Lifestyle'),array('name'=>'Thirteen','tag'=>'Media, Culture & Lifestyle'),array('name'=>'Joy Scents','tag'=>'Media, Culture & Lifestyle'),array('name'=>'Dr Scent','tag'=>'Media, Culture & Lifestyle'),array('name'=>'Jēra','tag'=>'Media, Culture & Lifestyle'));
            $this->add_control('clients', array('label' => __('Client list', 'threekg-elementor'), 'type' => \Elementor\Controls_Manager::REPEATER, 'fields' => $repeater->get_controls(), 'default' => $defaults, 'title_field' => '{{{ name }}}'));
            $this->end_controls_section();
        }
        protected function render() { $s = $this->get_settings_for_display(); ?>
          <section class="clients" id="clients"><div class="section-head reveal"><span class="mono">[04 — clients]</span><span class="mono"><?php echo esc_html(gmdate('Y')); ?></span><h2><?php echo wp_kses_post(nl2br(esc_html($s['title']))); ?></h2></div><ul class="clients__grid"><?php foreach ($s['clients'] as $client) : ?><li class="clients__tile reveal"><?php if (!empty($client['logo']['url'])) : ?><img class="clients__logo" src="<?php echo esc_url($client['logo']['url']); ?>" alt="<?php echo esc_attr($client['name']); ?>"><?php else : ?><span class="clients__name"><?php echo esc_html($client['name']); ?></span><?php endif; ?><span class="mono clients__tag"><?php echo esc_html($client['tag']); ?></span></li><?php endforeach; ?></ul></section>
        <?php }
    }

    class ThreeKG_Studio_Widget extends ThreeKG_Widget_Base {
        public function get_name() { return 'threekg_studio'; }
        public function get_title() { return __('3KG — Studio', 'threekg-elementor'); }
        protected function register_controls() {
            $this->start_controls_section('content', array('label' => __('Studio', 'threekg-elementor')));
            $this->text_control('title', __('Title', 'threekg-elementor'), 'Strategy first. Impact always.', \Elementor\Controls_Manager::TEXTAREA);
            $this->text_control('lead', __('Lead paragraph', 'threekg-elementor'), 'We start by immersing ourselves in your brand, understanding its needs, demands, and constraints while delving deep into the market, audience insights, and competitive landscape.', \Elementor\Controls_Manager::TEXTAREA);
            $this->text_control('body', __('Second paragraph', 'threekg-elementor'), 'At 3KG, we don’t just deliver what’s asked for and move on, we go beyond.', \Elementor\Controls_Manager::TEXTAREA);
            $this->add_control('studio_image', array('label' => __('Optional studio image', 'threekg-elementor'), 'type' => \Elementor\Controls_Manager::MEDIA));
            $repeater = new \Elementor\Repeater();
            $repeater->add_control('number', array('label' => __('Number', 'threekg-elementor'), 'type' => \Elementor\Controls_Manager::TEXT, 'default' => ''));
            $repeater->add_control('label', array('label' => __('Label', 'threekg-elementor'), 'type' => \Elementor\Controls_Manager::TEXT, 'default' => ''));
            $this->add_control('stats', array('label' => __('Statistics', 'threekg-elementor'), 'type' => \Elementor\Controls_Manager::REPEATER, 'fields' => $repeater->get_controls(), 'default' => array(), 'title_field' => '{{{ number }}} — {{{ label }}}'));
            $this->end_controls_section();
        }
        protected function render() { $s = $this->get_settings_for_display(); ?>
          <section class="studio" id="studio"><div class="section-head reveal"><span class="mono">[05 — the studio]</span><span class="mono">Cairo, Egypt</span><h2><?php echo esc_html($s['title']); ?></h2></div><?php if (!empty($s['studio_image']['url'])) : ?><figure class="studio__image reveal"><img src="<?php echo esc_url($s['studio_image']['url']); ?>" alt=""></figure><?php endif; ?><div class="studio__grid"><p class="reveal studio__lead"><?php echo esc_html($s['lead']); ?></p><p class="reveal studio__body"><?php echo esc_html($s['body']); ?></p></div><ul class="studio__stats reveal"><?php foreach ($s['stats'] as $stat) : ?><li><span class="mono stat__num"><?php echo esc_html($stat['number']); ?></span><span class="mono stat__cap"><?php echo esc_html($stat['label']); ?></span></li><?php endforeach; ?></ul></section>
        <?php }
    }

    class ThreeKG_Services_Widget extends ThreeKG_Widget_Base {
        public function get_name() { return 'threekg_services'; }
        public function get_title() { return __('3KG — Services Motion', 'threekg-elementor'); }
        protected function register_controls() {
            $this->start_controls_section('content', array('label' => __('Services', 'threekg-elementor')));
            $this->text_control('title', __('Title', 'threekg-elementor'), 'Six connected disciplines.');
            $repeater = new \Elementor\Repeater();
            $repeater->add_control('name', array('label' => __('Service', 'threekg-elementor'), 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'Service'));
            $repeater->add_control('hint', array('label' => __('Details', 'threekg-elementor'), 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'strategy · design · delivery'));
            $defaults = array(); foreach (array(array('Brand','Brand strategy · Positioning · Brand architecture · Naming · Verbal identity · Visual identity systems · Brand guidelines & rollout'),array('Design','Graphic design · Editorial design · Report design · Publications · Company profiles · Presentation systems · Packaging design'),array('Campaigns','Campaign strategy · Creative concepts · Launch campaigns · Integrated campaigns · Content strategy · Social media · Media planning & buying'),array('Production','Film production · Video production · Photography · Product & catalogue photography · Food styling · Motion graphics · Post-production'),array('Tech','Website design · UX/UI · Web development · Microsites · Digital catalogues · Digital platforms'),array('Xperience','Strategic gifting · BTL & activations · 3D design & printing · Object design · Environmental branding · Wayfinding · Interior branding')) as $row) { $defaults[] = array('name'=>$row[0],'hint'=>$row[1]); }
            $this->add_control('services', array('label' => __('Services (maximum six)', 'threekg-elementor'), 'type' => \Elementor\Controls_Manager::REPEATER, 'fields' => $repeater->get_controls(), 'default' => $defaults, 'title_field' => '{{{ name }}}'));
            $this->end_controls_section();
        }
        protected function render() { $s = $this->get_settings_for_display(); $keys = array('brand','design','campaigns','production','tech','xperience'); $services = array_slice($s['services'], 0, 6); ?>
          <section class="services" id="services"><div class="services__inner"><div class="services__stage"><div class="section-head reveal"><span class="mono">[06 — what we do]</span><span class="mono">capabilities</span><h2><?php echo esc_html($s['title']); ?></h2></div><div class="services__motion reveal" aria-live="polite"><div class="services__morph" aria-hidden="true"><svg class="services__morph-svg" viewBox="-120 -120 240 240" role="presentation"></svg></div><div class="services__motion-meta mono"><span class="services__motion-index">00 / 06</span><span class="services__motion-label">scroll to explore</span></div></div></div><ul class="services__list"><?php foreach ($services as $i => $service) : ?><li class="svc-card services__card" data-service="<?php echo esc_attr($keys[$i]); ?>"><span class="mono services__number"><?php echo esc_html(sprintf('%02d', $i + 1)); ?></span><h3 class="svc-card__name"><?php echo esc_html($service['name']); ?></h3><p class="mono svc-card__hint"><?php echo esc_html($service['hint']); ?></p></li><?php endforeach; ?></ul></div></section>
        <?php }
    }

    class ThreeKG_Contact_Widget extends ThreeKG_Widget_Base {
        public function get_name() { return 'threekg_contact'; }
        public function get_title() { return __('3KG — Contact Footer', 'threekg-elementor'); }
        protected function register_controls() {
            $this->start_controls_section('content', array('label' => __('Contact', 'threekg-elementor')));
            $this->text_control('cta', __('Call to action', 'threekg-elementor'), 'Start a project');
            $this->text_control('email', __('Email', 'threekg-elementor'), '');
            foreach (array('instagram'=>'Instagram','linkedin'=>'LinkedIn','behance'=>'Behance') as $id=>$label) { $this->add_control($id, array('label'=>$label, 'type'=>\Elementor\Controls_Manager::URL, 'placeholder'=>'https://')); }
            $this->end_controls_section();
        }
        protected function render() { $s = $this->get_settings_for_display(); ?>
          <footer class="footer" id="contact"><span class="mono footer__cap reveal">(get in touch)</span><a class="footer__cta reveal" href="<?php echo esc_url(is_email($s['email']) ? 'mailto:' . $s['email'] : 'https://threekg.com'); ?>"><?php echo esc_html($s['cta']); ?><span class="footer__arrow">→</span></a><div class="footer__grid"><div class="mono footer__col"><span class="footer__label">studio</span><span>ThreeKG®</span><span>working worldwide</span><span id="clockFooter">--:--:--</span></div><div class="mono footer__col"><span class="footer__label">contact</span><a href="<?php echo esc_url(is_email($s['email']) ? 'mailto:' . $s['email'] : 'https://threekg.com'); ?>"><?php echo esc_html($s['email'] ?: 'threekg.com'); ?></a><?php foreach (array('instagram'=>'Instagram','linkedin'=>'LinkedIn','behance'=>'Behance') as $id=>$label) : if (!empty($s[$id]['url'])) : ?><a href="<?php echo esc_url($s[$id]['url']); ?>" rel="noopener"><?php echo esc_html($label); ?> ↗</a><?php endif; endforeach; ?></div><div class="mono footer__col"><span class="footer__label">site</span><a href="#top">back to top ↑</a><span>© <?php echo esc_html(gmdate('Y')); ?> ThreeKG</span><span>made with quiet intent</span></div></div></footer>
        <?php }
    }

    class ThreeKG_Profile_Home_Widget extends ThreeKG_Widget_Base {
        public function get_name() { return 'threekg_profile_home'; }
        public function get_title() { return __('3KG — Profile Homepage R02.1', 'threekg-elementor'); }
        public function get_style_depends() { return array('threekg-revamp', 'threekg-profile'); }
        public function get_script_depends() { return array('threekg-revamp', 'threekg-profile-data', 'threekg-profile'); }
        protected function render() {
            get_template_part('template-parts/profile-home');
        }
    }

    foreach (array(new ThreeKG_Profile_Home_Widget(), new ThreeKG_Hero_Widget(), new ThreeKG_Showreel_Widget(), new ThreeKG_Work_Widget(), new ThreeKG_Clients_Widget(), new ThreeKG_Studio_Widget(), new ThreeKG_Services_Widget(), new ThreeKG_Contact_Widget()) as $widget) {
        $widgets_manager->register($widget);
    }
});

