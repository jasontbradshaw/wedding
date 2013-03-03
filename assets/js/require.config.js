require.config({
  baseUrl: 'assets/js',
  paths: {
    jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min'
  },
  main: 'main'
});
require(['main']);
