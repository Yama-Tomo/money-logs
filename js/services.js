angular.module('App.services', ['ui.bootstrap', 'angularLocalStorage'])
  .service('logs', ['$rootScope', '$filter', 'storage', function ($scope, $filter, storage) {
    var self = this;
    var where = $filter('filter');
    var checked = { checked: true };
    var unchecked = { checked: false };

    storage.bind($scope, "list", {defaultValue: []});

    // @todo
    $scope.currentTabId = 1; 

    $scope.$watch(function() {
      return $scope.list;
    }, function(value) {
      self.broadcast();
    }, true);
 
    $scope.$watch("currentTabId", function(){
      self.broadcast();
    });
    
    this.broadcast = function() {
      $scope.$broadcast('change:list', self.getList());
    };
 
    this.getCurrentTabId = function() {
      return $scope.currentTabId;
    };

    this.setCurrentTabId = function(id) {
      $scope.currentTabId = id;
    };

    this.getList = function() {
      return where($scope.list, function(row){
        return row.tab == $scope.currentTabId;
      });
    };

    this.getChecked = function() {
      return where($scope.list, checked);
    };
  
    this.add = function(title, price, tab) {
      $scope.list.push({
        title: title,
        price: price,
        checked: false,
        date: new Date().getTime(),
        tab: $scope.currentTabId
      });
    };
  
    this.remove = function (currentLog) {
      $scope.list = where($scope.list, function (row) {
        return row !== currentLog;
      });
    };
 
    // 現在のタブに紐付いているログを削除 
    this.removeCurrentTab = function (tab) {
      $scope.list = where($scope.list, function (row) {
        return row.tab !== tab.id;
      });
    };
 
    this.removeChecked = function () {
      $scope.list = where($scope.list, unchecked);
    };
  
    this.toggleChecked = function (isChecked) {
      angular.forEach(self.getList(), function (row) {
        row.checked = isChecked;
      });
    };

    this.changeTab = function (tab) {
      angular.forEach(where(self.getList(), checked), function (row) {
        row.tab = tab;
        row.checked = unchecked;
      });
    };
  }])
  .service('tabs', ['$rootScope', '$filter', 'storage', 'logs', function ($scope, $filter, storage, logs) {
    var where = $filter('filter');

    $scope.defaultTab = {id: 1, title: "default"};

    storage.bind($scope, "tabs", {defaultValue: [$scope.defaultTab]});

    $scope.$watch(function () {
      return $scope.tabs;
    }, function (value) {
      $scope.$broadcast('change:tabList', value);
    }, true);
 
    this.getDefaultTab = function() {
      return $scope.defaultTab;
    };

    this.get = function() {
      return $scope.tabs;
    };

    this.add = function (title, limit) {
      if(typeof limit === 'undefined') limit = null;
      $scope.tabs.push({
        id: new Date().getTime(),
        title: title,
        limit: limit
      });
    };

    this.remove = function(removeTab) {
      $scope.tabs = where($scope.tabs, function (row) {
        return removeTab !== row;
      });

      // 紐付いているログも削除
      logs.removeCurrentTab(removeTab);
    };
  }]);
