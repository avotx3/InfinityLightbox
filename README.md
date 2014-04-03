InfinityLightbox
================

Small, fast and adaptive lightbox jquery plugin. Html5 and css3 based and mobile ready out of the box.

Site: http://avotx3.ru

!! Important: it is not final version of software, use in production and key-points of business at your own risk.

About lightbox:

1. Fantastic small - about 10Kb minifed .js and .css and nothing else.
2. Ready for mobile use out of the box, responsive and adaptive. 
3. Support swipe on devices with sensor input.
4. Support arrow keys control on devices with physical keyboard.
5. Based on css3 transactions and transforms - full hardware accelerated and very fast everywhere.
6. Simple for use: ```jQuery(el).infinityLightbox();``` by default and it work.

Settings:

```
jQuery(el).infinityLightbox({
  'margin': 100, // Margin on desktop
  'marginMobile': 10, // Margin on mobile
  'speed1': 200, // Resizing anomation speed
  'speed2': 200, // Image opacity change animation speed
  'caption': 'Изображение $a из $b', // Caption string, $a,$b replace with index and number of images
  'helper': true, // Show or hide helper
  'helperType': 'number', // Helper type 'number' for 'caption' and 'alt' for alt attr of miniature image
  'animateImage': function() // Programm animation of image emersion
});
```
