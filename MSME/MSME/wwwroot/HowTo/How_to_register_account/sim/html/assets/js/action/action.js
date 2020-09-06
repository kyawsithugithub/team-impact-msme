/** 
* Defines the main Action class for all action types to extend
* @constructor
*/
var Action = new Class({
    
	initialize: function(o){
        for(var prop in o)
		{
			this[prop] = o[prop];
		}
		this.alphas = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
		this.context = null;
		this.interactionsType = 'true-false';
    },

	getCorrectResponse: function()
	{
		return this.correctResponse;
	},

	getStudentResponse: function()
	{
		return this.studentResponse;
	},

	flashAction: function(c)
	{
		var self = this;
		c.style.display = (c.style.display == "block") ? "none" : "block";

		var func = function()
		{
			self.flashAction(c);
		}
		setTimeout(func,1000);
	},

	markCorrect: function()
	{
		this.step.markCorrect();
	},

	markIncorrect: function()
	{
		this.step.markIncorrect();
	},

	getRectangle: function()
	{
		try
		{
			if(this.rectangle)
			{
				return this.rectangle;
			}
			else if(this.dragTarget.rectangle)
			{
				return this.dragTarget.rectangle;
			}
		}
		catch(e){}
	},

	toString: function()
	{
		return "Action: "+this.actionMode;
	},

	setFocus: function(){},
	disable: function(){},
	enable: function(){}
});