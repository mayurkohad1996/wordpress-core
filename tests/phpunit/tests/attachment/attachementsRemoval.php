<?php 
/**
 * Tests that wp_delete_object_term_relationships( $post_id, array( 'category', 'post_tag' ) ); is redundant.
 * 
 * @group attachment
 * @group attachmentRemoval
 * @ticket 600052
 *
 * @covers ::wp_delete_object_term_relationships
 */
class WP_Delete_Attachment_Test extends WP_UnitTestCase {

    public function test_delete_attachment_removes_term_relationships() {
        // Create an attachment post.
        $attachment_id = $this->factory->attachment->create_upload_object( DIR_TESTDATA . '/images/canola.jpg' );

        // Create categories and tags.
        $category_id = wp_create_category( 'Test Category' );
        $tag_id = wp_insert_term( 'Test Tag', 'post_tag' )['term_id'];

        // Assign terms to the attachment.
        wp_set_object_terms( $attachment_id, array( $category_id ), 'category' );
        wp_set_object_terms( $attachment_id, array( $tag_id ), 'post_tag' );

        // Ensure the attachment has terms before deletion.
        $this->assertNotEmpty( wp_get_object_terms( $attachment_id, 'category' ) );
        $this->assertNotEmpty( wp_get_object_terms( $attachment_id, 'post_tag' ) );

        // Delete the attachment.
        wp_delete_attachment( $attachment_id, true );

        // Check that terms are removed.
        $this->assertEmpty( wp_get_object_terms( $attachment_id, 'category' ) );
        $this->assertEmpty( wp_get_object_terms( $attachment_id, 'post_tag' ) );
    }
}

