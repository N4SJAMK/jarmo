var scroll   = require('scroll-into-view');
var scroller = document.getElementById('jarmo-scroller');

scroller.addEventListener('click', function() {
	return scroll(document.getElementById('jarmo-description'));
});
