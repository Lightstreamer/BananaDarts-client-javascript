


require(["js/Simulator"],function(Simulator) {
  
  var Collection = function(el,champions) {
    this.el = $(el);
    this.sims = [];
    this.champions = champions;
  };
  Collection.prototype = {
      add: function() {
        this.sims.push(new Simulator(null,this.champions));
        this.el.text(this.sims.length);
      },
      remove: function() {
        if (this.sims.length <= 0) {
          return;
        }
        var closing = this.sims.shift();
        closing.dispose();
        this.el.text(this.sims.length);
      }
  };

  
  $(document).ready(function() {
    
    var champions = new Collection("#champion",true);
    var simulators = new Collection("#simple",false);
    
    $("#addChampion").click(function() {
      champions.add();
    });
    $("#addSimple").click(function() {
      simulators.add();
    });
    
    $("#removeChampion").click(function() {
      champions.remove();
    });
    $("#removeSimple").click(function() {
      simulators.remove();
    });
    
  });  
  
  
  
  
  
});