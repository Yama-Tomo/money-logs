angular.module('App.controllers', [])
  .controller('GlobalController', ['$scope', 'logs', '$location', '$anchorScroll', function ($scope, logs, $location, $anchorScroll) {
    $scope.$on('change:list', function (evt, list) {
      $scope.toolbar_hide = true;
      if (logs.getChecked().length > 0) {
        $scope.toolbar_hide = false;
      }
    });

  }])
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

    $scope.moveTab = function() {
      logs.changeTab($scope.moveTabId);
    };

    $scope.removeCheckedLog = function () {
      logs.removeChecked();
    };
  }])
  .controller('TodoListController', ['$scope', 'logs', '$filter', 'tabs', function ($scope, logs, $filter, tabs) {
    var where = $filter('filter');
    var originalTilte,originalPrice;
    var editModeStat = [];

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

    $scope.toggleEditMode = function($evt, log)  {
      var $el = angular.element($evt.target);

      if ($el[0].tagName === 'DIV') {
        if ($scope.editing === log) {
          $scope.editing = originalTilte = originalPrice = null;
          return;
        }
      }

      $scope.editing = log;
      originalTilte = log.title;
      originalPrice = log.price;
    }
     
    $scope.doneEdit = function (logForm) {
      if (logForm.$invalid) {
        $scope.editing.title = originalTilte;
        $scope.editing.price = originalPrice;
      }
    };
  }])
  .controller('TabsController', ['$scope', 'logs', 'tabs', '$modal', function ($scope, logs, tabs, $modal) {
    $scope.$on('change:tabList', function (evt, list) {
      $scope.tabs = list;
    });

    $scope.defaultTab = tabs.getDefaultTab();
    $scope.currentTab = tabs.getCurrentTab();

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

    var ModalInstance = function ($scope, $modalInstance, tab, defaultTab) {
      $scope.input = {}
      $scope.is_edit = false;
      $scope.defaultTab = defaultTab;
      if (tab !== null ) {
        $scope.input.newTabName = tab.title;
        $scope.input.newLimit   = tab.limit;
        $scope.currentTabId     = tab.id;
        $scope.is_edit          = true;
      }

      $scope.remove = function () {
        $modalInstance.close({act: 'remove', id: tab.id});
      };    

      $scope.ok = function () {
        $modalInstance.close({act: 'update', title: $scope.input.newTabName, limit:$scope.input.newLimit});
      };
    
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };

    $scope.editTab = function() {
      $scope.currentTab = tabs.getCurrentTab();
      if ($scope.currentTab.length > 0) {
        this.openTab($scope.currentTab[0]);
      }
    }

    $scope.openTab = function (tab) {
      if(typeof tab === 'undefined') tab = null;
      var modalInstance = $modal.open({
        templateUrl: 'ModalContent.html',
        controller: ModalInstance,
        resolve: {
          tab: function() {
            return tab;
          },
          defaultTab: function() {
            return $scope.defaultTab;
          }
        }
      });
  
      modalInstance.result.then(function(obj) {
        if (tab === null) {
          tabs.add(obj.title, obj.limit);
        } else if(obj.act == 'remove') {
          tabs.remove(tab);
        } else if(obj.act == 'update') {
          tab.title = obj.title;
          tab.limit = obj.limit;
          // タブを編集したらログの再描画
          logs.broadcast();
        }
      });
    };
  }]);

