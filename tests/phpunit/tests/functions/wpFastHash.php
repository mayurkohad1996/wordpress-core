<?php
/**
 * Test wp_fast_hash() function.
 *
 * @since 6.8.0
 * @group functions
 * @covers ::wp_fast_hash
 */
class Tests_Functions_wpFastHash extends WP_UnitTestCase {

	/**
	 * The schema of the wp_users table on wordpress.org has not been updated since the schema was changed in
	 * [35638] for WordPress 4.4, which means the `user_activation_key` field remains at 60 characters length
	 * instead of the expected 255. Although this is unlikely to affect others sites, let's accommodate for this
	 * by ensuring that the length of this hash, which is used for password resets, does not exceed 60 characters.
	 *
	 * @ticket 21022
	 */
	public function test_wp_fast_hash_length_does_not_exceed_60_chars() {
		$this->assertLessThanOrEqual( 60, strlen( wp_fast_hash( 'test' ) ) );
	}
}
