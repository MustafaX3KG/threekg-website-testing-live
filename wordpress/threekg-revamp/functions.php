<?php
if (!defined('ABSPATH')) {
    exit;
}

function threekg_revamp_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array('search-form', 'gallery', 'caption', 'style', 'script'));
    add_theme_support('responsive-embeds');
    register_nav_menus(array('primary' => __('Primary navigation', 'threekg-revamp')));
}
add_action('after_setup_theme', 'threekg_revamp_setup');

function threekg_revamp_assets() {
    $version = wp_get_theme()->get('Version');
    wp_enqueue_style('threekg-revamp', get_template_directory_uri() . '/assets/style.css', array(), $version);
    wp_enqueue_script('threekg-revamp', get_template_directory_uri() . '/assets/script.js', array(), $version, true);
    wp_enqueue_style('threekg-profile', get_template_directory_uri() . '/assets/profile.css', array('threekg-revamp'), $version);
    wp_enqueue_style('threekg-wordpress', get_template_directory_uri() . '/assets/wordpress.css', array('threekg-profile'), $version);
    wp_enqueue_script('threekg-profile-data', get_template_directory_uri() . '/assets/profile-data.js', array('threekg-revamp'), $version, true);
    wp_enqueue_script('threekg-profile', get_template_directory_uri() . '/assets/profile.js', array('threekg-profile-data'), $version, true);
    wp_enqueue_style('threekg-website', get_template_directory_uri() . '/assets/website.css', array('threekg-wordpress'), $version);
    wp_enqueue_script('threekg-website', get_template_directory_uri() . '/assets/website.js', array('threekg-profile'), $version, true);
}
add_action('wp_enqueue_scripts', 'threekg_revamp_assets');

function threekg_revamp_body_classes($classes) {
    if (is_front_page()) {
        $classes[] = 'is-loading';
    }
    return $classes;
}
add_filter('body_class', 'threekg_revamp_body_classes');

function threekg_revamp_elementor_support() {
    add_theme_support('elementor');
}
add_action('after_setup_theme', 'threekg_revamp_elementor_support');

function threekg_revamp_customize($customizer) {
    $customizer->add_section('threekg_contact', array(
        'title' => __('ThreeKG contact details', 'threekg-revamp'),
        'priority' => 30,
    ));
    $customizer->add_setting('threekg_contact_email', array(
        'default' => '',
        'sanitize_callback' => 'sanitize_email',
    ));
    $customizer->add_control('threekg_contact_email', array(
        'label' => __('Contact email', 'threekg-revamp'),
        'section' => 'threekg_contact',
        'type' => 'email',
    ));
}
add_action('customize_register', 'threekg_revamp_customize');

function threekg_project_meta($post_id, $key, $fallback = '') {
    $value = get_post_meta($post_id, $key, true);
    return $value !== '' ? $value : $fallback;
}

function threekg_fallback_image($index) {
    return get_template_directory_uri() . '/assets/brand/3kg-mark.png';
}

function threekg_archive_columns($index) {
    $classes = array('work-block--full', 'work-block--right', 'work-block--left', 'work-block--side');
    return $classes[$index % count($classes)];
}

