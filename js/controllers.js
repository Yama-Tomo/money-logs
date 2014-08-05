angular.module('App.controllers', [])
  .controller('RegisterController', ['$scope', 'logs', function ($scope, logs) {
    $scope.newTitle = $scope.newPrice = '';

    $scope.addLog = function () {
      logs.add($scope.newTitle, $scope.newPrice);
      $scope.newTitle = $scope.newPrice = '';
    };
  }])
  .controller('ToolbarController', ['$scope', 'logs', 'tabs', function ($scope, logs, tabs) {
    $scope.moveTabId = tabs.getDefaultTab().id;

    $scope.$on('change:tabList', function (evt, list) {
      $scope.tabs = list;
    });

    $scope.$on('change:list', function (evt, list) {
      $scope.toolbar_hide = true;
      if (logs.getChecked().length > 0) {
        $scope.toolbar_hide = false;
      }
    });
 
    $scope.moveTab = function() {
      logs.changeTab($scope.moveTabId);
    };

    $scope.removeCheckedLog = function () {
      logs.removeChecked();
    };
  }])
  .controller('TodoListController', ['$scope', 'logs', '$filter', 'tabs', function ($scope, logs, $filter, tabs) {
    var where = $filter('filter');
    var originalVal;

    $scope.$on('change:list', function (evt, list) {
      $scope.logs = list;

      var total = 0;
      angular.forEach(list, function (val) {
        total = parseInt(total) + parseInt(val.price);
      });
      $scope.total = total;
 
      currentTab = where(tabs.get(), function(row){
        return row.id == logs.getCurrentTabId();
      });

      $scope.limit = null;
      if (currentTab.length > 0 && currentTab[0].limit != null) {
        $scope.limit = currentTab[0].limit;
      }
    });
  
    $scope.editing = $scope.element = null;
  
    $scope.editLog = function (log, element) {
      if (element == 'title') {
        originalVal = log.title;
      }
      if (element == 'price') {
        originalVal = log.price;
      }
      $scope.editing = log;
      $scope.element = element;
    };
  
    $scope.doneEdit = function (logForm, element) {
      if (logForm.$invalid) {
        if (element == 'title') {
          $scope.editing.title = originalVal;
        }
        if (element == 'price') {
          $scope.editing.price = originalVal;
        }
      }
      $scope.editing = originalVal = null;
    };
  }])
  .controller('TabsController', ['$scope', 'logs', 'tabs', '$modal', function ($scope, logs, tabs, $modal) {
    $scope.$on('change:tabList', function (evt, list) {
      $scope.tabs = list;
    });

    $scope.defaultTab = tabs.getDefaultTab();

    $scope.allChecked = false; 
    $scope.checkAll = function () {
      logs.toggleChecked($scope.allChecked);
    };

    $scope.removeTab = function(tab){ 
      tabs.remove(tab);
    }

    $scope.changeTab = function(tabId){ 
      logs.setCurrentTabId(tabId); 
    }

    var ModalInstance = function ($scope, $modalInstance, tab) {
      $scope.input = {}
      $scope.is_edit = false;
      if (tab !== null ) {
        $scope.input.newTabName = tab.title;
        $scope.input.newLimit   = tab.limit;
        $scope.is_edit          = true;
      }
    
      $scope.ok = function () {
        $modalInstance.close({title: $scope.input.newTabName, limit:$scope.input.newLimit});
      };
    
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };

    $scope.openTab = function (tab) {
      if(typeof tab === 'undefined') tab = null;
      var modalInstance = $modal.open({
        templateUrl: 'ModalContent.html',
        controller: ModalInstance,
        resolve: {
          tab: function() {
            return tab;
          }
        }
      });
  
      modalInstance.result.then(function(obj) {
        if (tab === null) {
          tabs.add(obj.title, obj.limit);
        } else {
          tab.title = obj.title;
          tab.limit = obj.limit;
          // タブを編集したらログの再描画
          logs.broadcast();
        }
      });
    };
  }]);

