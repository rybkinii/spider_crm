<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <base href="/" />
    <title>Mobile Angular UI Demo</title>
    
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimal-ui" />
    <meta name="apple-mobile-web-app-status-bar-style" content="yes" />
    
    <link rel="shortcut icon" href="favicon.png" type="image/x-icon" />
	

	
    <link rel="stylesheet" href="/modules/style.php?module=Site">
    <link rel="stylesheet" href="/modules/style.php?module=OnplatStatistic">

    
    <script src="/modules/script.php?module=Site"></script>
    <script src="/modules/script.php?module=OnplatStatistic"></script>
	
  </head>

  <body ng-app="SiteApp" ng-controller="CtrlMain" >

    <!-- Sidebars -->
    <div ng-if='FSession.current && !FSession.current.garbage' ng-include="'templates/sidebar.html'" ui-track-as-search-param="true" class="sidebar sidebar-left"></div>
    

    <div class="app" ui-swipe-right="Ui.turnOn('uiSidebarLeft')" ui-swipe-left="Ui.turnOff('uiSidebarLeft')">

      <!-- Navbars -->

      <div class="navbar navbar-app navbar-absolute-top">
        <div class="navbar-brand navbar-brand-center" ui-yield-to="title">
          Onplat
        </div>
		
        <div class="btn-group pull-left" ng-if='FSession.current && !FSession.current.garbage'>
          <div ui-toggle="uiSidebarLeft" class="btn sidebar-toggle">
            <i class="fa fa-bars"></i> Меню
          </div>
        </div>
		<!--<div  ng-include="'templates/nav-top.html'" ></div>-->
        <!--<div class="btn-group" ui-yield-to="navbarAction" ng-if="rightside">
          <div ui-toggle="uiSidebarRight" class="btn sidebar-right-toggle" >
            <i class="fa fa-info"></i> {{rightsidetitle}}
          </div>
        </div>-->
      </div>

      <!--<div class="navbar navbar-app navbar-absolute-bottom">
        <div class="btn-group justified">
          <a href="/docs" class="btn btn-navbar"><i class="fa fa-home fa-navbar"></i> Docs</a>
          <a href="https://github.com/mcasimir/mobile-angular-ui" class="btn btn-navbar"><i class="fa fa-github fa-navbar"></i> Sources</a>
          <a href="https://github.com/mcasimir/mobile-angular-ui/issues" class="btn btn-navbar"><i class="fa fa-exclamation-circle fa-navbar"></i> Issues</a>
        </div>
      </div>-->

      <!-- App Body -->
      <div class="app-body" ng-class="{loading: loading}">
        <div ng-show="loading" class="app-content-loading">
          <i class="fa fa-spinner fa-spin loading-spinner"></i>
        </div>
        <div class="app-content">
          <ng-view></ng-view>
        </div>
      </div>

    </div><!-- ~ .app -->

    <div ui-yield-to="modals"></div>
  </body>
</html>
