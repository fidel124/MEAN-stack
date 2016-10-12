var myApp = angular.module("myMeanstack", []);

myApp.factory('WebSiteService',['$http', function($http){
   /* var findStat = function(callback){
        $http.get('/api/statistic')
        .success(callback);
    }; */

    var findAll = function(callback){
        $http.get('/api/website')
        .success(callback);
    };

    var create = function(website, callback){
      $http.post("/api/website", website)
      .success(callback);
    };

    var remove = function(id, callback){
       $http.delete('/api/website/'+id)
       .success(callback);
    }

    var edit = function(id, callback){           
      $http.get('/api/website/'+id)
      .success(callback);    
    }

    return{
      create: create,
      findAll: findAll,
      //findStat: findStat,
      remove: remove,
      edit: edit
    }
}]);

myApp.controller("DeveloperController", function($scope, $http, WebSiteService){
    /* WebSiteService.findStat(function(response){
      $scope.statObj = response;            
    }); */   

    WebSiteService.findAll(function(response){
      $scope.websites = response;            
    });
    
    $scope.add = function(website){
       if (typeof $scope.website.id === 'undefined') {               
       WebSiteService.create(website, function(response){
          $scope.websites = response; 
          $scope.website = {};                       
       });
       } 
    }     

    $scope.remove = function(id){
      WebSiteService.remove(id, function(response){
        $scope.websites = response;
      });     
    }

    $scope.edit = function(id){  
      if (typeof id != 'undefined') {     
      WebSiteService.edit(id,function(response){
         $scope.website = response;
      });
      }    
    };

   $scope.save = function(){
    $http.put('/api/website/'+ $scope.website._id, $scope.website).success(function(response){
         $scope.website = response;
         $scope.website ={}; 
         WebSiteService.findAll(function(response){
           $scope.websites = response;
         });         
      });
       
   };

});