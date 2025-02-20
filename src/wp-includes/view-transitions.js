// This script should eventually live elsewhere, but for now it's just in `wp-includes` for simplicity.
if ( !! window.navigation && 'CSSViewTransitionRule' in window ) {
	const config = { __PLACEHOLDER__: true };

	const getViewTransitionEntries = ( bodyElement, articleElement ) => {
		return [
			...Object.entries( config.globalTransitionNames || {} ).map( ( [ name, selector ] ) => {
				return [ bodyElement.querySelector( selector ), name ];
			} ),
			...( articleElement
				? Object.entries( config.postTransitionNames || {} ).map( ( [ name, selector ] ) => {
					return [ articleElement.querySelector( selector ), name ];
				} )
				: []
			),
		];
	};

	const setTemporaryViewTransitionNames = async ( entries, vtPromise ) => {
		for ( const [ element, name ] of entries ) {
			if ( ! element ) {
				continue;
			}
			element.style.viewTransitionName = name;
		}

		await vtPromise;

		for ( const [ element, _ ] of entries ) {
			if ( ! element ) {
				continue;
			}
			element.style.viewTransitionName = '';
		}
	};

	const appendSelectors = ( selectors, append ) => {
		return selectors.split( ',' ).map( subselector => subselector.trim() + ' ' + append ).join( ',' );
	};

	const getArticle = () => {
		if ( ! config.postSelector ) {
			return null;
		}
		return document.querySelector( config.postSelector );
	};

	const getArticleForUrl = ( url ) => {
		if ( ! config.postSelector ) {
			return null;
		}
		const postLinkSelector = appendSelectors( config.postSelector, 'a[href="' + url + '"]' );
		const articleLink = document.querySelector( postLinkSelector );
		if ( ! articleLink ) {
			return null;
		}
		return articleLink.closest( config.postSelector );
	};

	window.addEventListener( 'pageswap', ( e ) => {
		if ( e.viewTransition ) {
			if ( document.body.classList.contains( 'single' ) ) {
				setTemporaryViewTransitionNames(
					getViewTransitionEntries( document.body, getArticle() ),
					e.viewTransition.finished
				);
			} else if ( document.body.classList.contains( 'home' ) || document.body.classList.contains( 'archive' ) ) {
				setTemporaryViewTransitionNames(
					getViewTransitionEntries( document.body, getArticleForUrl( e.activation.entry.url ) ),
					e.viewTransition.finished
				);
			}
		}
	} );

	window.addEventListener( 'pagereveal', ( e ) => {
		if ( e.viewTransition ) {
			if ( document.body.classList.contains( 'single' ) ) {
				setTemporaryViewTransitionNames(
					getViewTransitionEntries( document.body, getArticle() ),
					e.viewTransition.ready
				);
			} else if ( document.body.classList.contains( 'home' ) || document.body.classList.contains( 'archive' ) ) {
				setTemporaryViewTransitionNames(
					getViewTransitionEntries( document.body, window.navigation.activation.from ? getArticleForUrl( window.navigation.activation.from.url ) : null ),
					e.viewTransition.ready
				);
			}
		}
	} );
} else {
	window.console.warn( 'View transitions not loaded as the browser is lacking support.' );
}
