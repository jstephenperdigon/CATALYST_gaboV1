import 'dart:js' as js;

void initMap() {
  final mapOptions = js.JsObject.jsify({
    'center': js.JsObject.jsify({'lat': -34.397, 'lng': 150.644}),
    'zoom': 8,
  });

  final map = js.context['google']['maps']['Map'](js.context['document']['getElementById']('map'), mapOptions);
}
