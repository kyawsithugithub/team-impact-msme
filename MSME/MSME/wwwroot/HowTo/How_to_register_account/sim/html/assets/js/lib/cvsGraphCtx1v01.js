/*=============================================================
  Filename: cvsGraphCxt1v00.js
  Rev: 1
  By: A.R.Collins
  Description: A basic graphics interface for the canvas
  element.
  License: Released into the public domain
  latest version at
  <http://www/arc.id.au/CanvasGraphics.html>
  Requires:
  - IE canvas emulator 'excanvas-modified.js' from
  <http://www.extjs.com/playpen/tm/excanvas-patch/>.
  - Text support 'canvastext.js' from
  <http://www.federated.com/~jim/canvastext/>
  - color parser 'rgbaColor.js'
  - SVH Path support 'cvsSVGpaths-01.js'

  Date   |Description                                      |By
  -------------------------------------------------------------
  04Nov09 Rev 1.00 First release based on cvsGrapLib5v05
          SVGPath method moved to optional cvsSVGpaths.js   ARC
  ============================================================= */

  var _resized = new Array();   // keep track of which canvases are initialised
  var _busy = new Array();      // index by canvas id each element is a busy flag

  function CvsGraphCtx(canvasId)
  {
    this.cId = canvasId;
    this.cnvs = document.getElementById(this.cId);
    this.rawWidth = this.cnvs.offsetWidth;
    this.rawHeight = this.cnvs.offsetHeight;
    this.aRatio = this.rawWidth/this.rawHeight;

    if (!(this.cId in _resized))
    {
    /* make canvas native aspect ratio equal style box aspect ratio.
       only do this once for each canvas as it clears the canvas.
       A second graph to be drawn will erase the firt graph if the canvas
       width and height attributes are reset */
      /* Note: rawWidth and rawHeight are floats, assignment to ints will truncate */
        this.cnvs.setAttribute('width', this.rawWidth);     // this actually reset the number of graphics pixels
        this.cnvs.setAttribute('height', this.rawHeight);   // use this instead of style to match emulator

      /* create an element in associative array for this canvas
         element's existance is the test that resize has been done.
         Could have used the existance of the busy flag but lets use
         separate code for separate function */
      _resized[this.cId]= true;
    }

    if (!(this.cId in _busy))
    {
      /* this code is only executed for the first graph on each canvas
         create a busy flag for the graphics engine to prvent asynchronous
         drawing when ctx may be distorted during another call. All asynchronous
         drawing functions must be re-callable with builtin timeout and only execute
         when ctx !busy.
       */
      _busy[this.cId] = false;
    }

    this.ctx = this.cnvs.getContext('2d');
    this.ctx.save();

    this.vpW = this.rawWidth;         // vp width in pixels (default to full canvas size)
    this.vpH = this.rawHeight;        // vp height in pixels
    this.vpLLx = 0;                   // vp lower left from canvas left in pixels
    this.vpLLy = this.rawHeight;      // vp lower left from canvas top
    this.xscl = this.rawWidth/100;    // world x axis scale factor, default canvas width = 100 native units
    this.yscl = -this.rawWidth/100;   // world y axis scale factor, default +ve up and canavs height =100*aspect ratio (square pixels)
    this.xoffset = 0;                 // world x origin offset from viewport left in pixels
    this.yoffset = 0;                 // world y origin offset from viewport bottom in pixels
                                      // *** to move to world coord x ***
                                      // 1. from pixel x origin (canvas left) add vpLLx (gets to viewport left)
                                      // 2. add xoffset to get to pixel location of world x origin
                                      // 3. add x*xscl pixels to get to world x location.
                                      // ==> x (in world coords) == vpLLx + xoffset + x*xscl (pixels location of canvas)
                                      // ==> y (in world coords) == vpLLy + yoffset + y*xscl (pixels location of canvas)

    this.rotA = 0;                 // world coordinate rotation (in rads)
    this.rotX = 0;                    // origin for world corrd rotation in raw pixels;
    this.rotY = 0;

    this.penCol = "rgba(0, 0, 0, 1.0)";        // black
    this.penWid = 1;             // pixels
    this.bkgCol = "rgba(255, 255, 255, 1.0)";  // white
    this.fontSize = 10;          // 10pt

    this.penX = 0;   // pen position in world coordinates
    this.penY = 0;

    this.dashX = 0;  // working variable for dashed lines
    this.dashY = 0;
  }

  CvsGraphCtx.prototype._setCtx = function()
  {
    // often used in the library calls as the penCol etc may have been set by assignment rather than setPenColor()
    this.ctx.fillStyle = this.penCol;
    this.ctx.lineWidth = this.penWid;
    this.ctx.strokeStyle = this.penCol;
  }

  CvsGraphCtx.prototype.clearCanvas = function()
  {
    this.ctx.clearRect(0, 0, this.rawWidth, this.rawWidth);
    // all drawing erased
    // but all global graphics contexts remain intact
    this.clearRotation();   // reset rotation
  }

  CvsGraphCtx.prototype.setViewport = function(lowerLeftX, lowerLeftY, w, h)
  {
    if (h != undefined)
    {
      this.vpW = 0.01*w*this.rawWidth;
      this.vpH = 0.01*h*this.rawWidth;
      this.vpLLx = 0.01*lowerLeftX*this.rawWidth;
      this.vpLLy = this.rawHeight-0.01*lowerLeftY*this.rawWidth;
    }
    else
    {
      this.vpW = this.rawWidth;
      this.vpH = this.rawHeight;
      this.vpLLx = 0;
      this.vpLLy = this.rawHeight;
    }
    this.setWorldCoords();     // if new viewport, world coords are garbage, so reset to defaults
  }

  CvsGraphCtx.prototype.clearViewport = function()
  {
    /* Not supported by excanvas, which implements clearRect by 'deleteNode'
       so it becomes equivalent to clearCanvas,
       So it is recommended to use clearCanvas and avoid clearViewport until excanvas is fixed */

    this.ctx.clearRect(this.vpLLx, this.vpLLy - this.vpH, this.vpW, this.vpH); // referenced from top left corner
  }

  CvsGraphCtx.prototype.fillViewport = function(fillColor)
  {
    /* fillViewport() sets the background color and fills the viewport to that color */
    var color;

    if (fillColor != undefined)
    {
      color = new RGBAColor(fillColor);

      if (color.ok)
        this.bkgCol = color.toRGBA();
    }

    if (this.rotA)
    {
      this.ctx.save();
      // setup for rotation by rot degrees
      this.ctx.translate(this.rotX, this.rotY);   // move transform origin to the requested origin
      this.ctx.rotate(this.rotA);
      this.ctx.translate(-this.rotX, -this.rotY);   // move origin back
    }

    this.ctx.fillStyle = this.bkgCol;
    this.ctx.fillRect(this.vpLLx, (this.vpLLy-this.vpH), this.vpW, this.vpH); // fill referenced from top left corner

    if (this.rotA)
      this.ctx.restore();
  }

  CvsGraphCtx.prototype.setWorldCoords = function(leftX, rightX, lowerY, upperY)
  {
    if (upperY != undefined)
    {
      this.xscl = this.vpW/(rightX-leftX);
      this.yscl = -(this.vpH/(upperY-lowerY));
      this.xoffset = -leftX*this.xscl;
      this.yoffset = -lowerY*this.yscl;
    }
    else
    {
      this.xscl = this.rawWidth/100;    // makes xaxis = 100 native units
      this.yscl = -this.rawWidth/100;   // makes yaxis = 100*aspect ratio ie. square pixels
      this.xoffset = 0;
      this.yoffset = 0;
    }

    this.clearRotation();   // reset rotation
    // world coords have changed, reset pen world coords
		this.penX = 0;
		this.penY = 0;
  }

  CvsGraphCtx.prototype.setRotation = function(orgX, orgY, degs)
  {
    this.rotA = -degs*Math.PI/180.0;      // measure angles counter clockwise
    this.rotX = this.vpLLx+this.xoffset+orgX*this.xscl;
    this.rotY = this.vpLLy+this.yoffset+orgY*this.yscl;
  }

  CvsGraphCtx.prototype.clearRotation = function()
  {
    this.rotA = 0;
    this.rotX = 0;
    this.rotY = 0;
  }

  CvsGraphCtx.prototype.setPenColor = function(color)
  {
    var newCol = new RGBAColor(color);

    if (newCol.ok)
      this.penCol = newCol.toRGBA();    // if no color passed then just restore this graph's pen color

    this.ctx.strokeStyle = this.penCol;
    this.ctx.fillStyle = this.penCol;
  }

  CvsGraphCtx.prototype.setPenWidth = function(w)    // w in screen px
  {
    if (typeof w != "undefined")
      this.penWid = w;

    this.ctx.lineWidth = this.penWid;
  }

  CvsGraphCtx.prototype.setFontSize = function(s)    // s in points
  {
    if (typeof s != "undefined")
      this.fontSize = s;
  }

  CvsGraphCtx.prototype.move = function(x, y) /* from current pen position to x,y */
  {
    if (this.rotA)
    {
      this.ctx.save();
      // setup for rotation by rot degrees
      this.ctx.translate(this.rotX, this.rotY);   // move transform origin to the requested origin
      this.ctx.rotate(this.rotA);
      this.ctx.translate(-this.rotX, -this.rotY);   // move origin back
    }

    this.ctx.beginPath();    // reset current path to null and move to 0,0
    this.ctx.moveTo(this.vpLLx+this.xoffset+x*this.xscl, this.vpLLy+this.yoffset+y*this.yscl);

    if (this.rotA)
      this.ctx.restore();

    // update world coords of pen
		this.penX = x;
		this.penY = y;
  }

  CvsGraphCtx.prototype.line = function(x, y, style)  /* from current pen position to x, y */
  {
    if (this.rotA)
    {
      this.ctx.save();
      // setup for rotation by rot degrees
      this.ctx.translate(this.rotX, this.rotY);   // move transform origin to the requested origin
      this.ctx.rotate(this.rotA);
      this.ctx.translate(-this.rotX, -this.rotY);   // move origin back
    }

    this._setCtx();   // set up the stroke and fill styles
		if (style == "dashed")
		{
		  // set the current pen postion for dashed line calcs
      this.dashX = this.vpLLx+this.xoffset+this.penX*this.xscl;
      this.dashY = this.vpLLy+this.yoffset+this.penY*this.yscl;
			this.dashTo(this.vpLLx+this.xoffset+x*this.xscl, this.vpLLy+this.yoffset+y*this.yscl, 6, 8)
      this.ctx.stroke();
		}
    else if (style == "dotted")
		{
		  // set the current pen postion for dashed line calcs
      this.dashX = this.vpLLx+this.xoffset+this.penX*this.xscl;
      this.dashY = this.vpLLy+this.yoffset+this.penY*this.yscl;
			this.dashTo(this.vpLLx+this.xoffset+x*this.xscl, this.vpLLy+this.yoffset+y*this.yscl, 2, 6)
      this.ctx.stroke();
		}
    else
		{
      this.ctx.lineTo(this.vpLLx+this.xoffset+x*this.xscl, this.vpLLy+this.yoffset+y*this.yscl);
      this.ctx.stroke();
		}

    if (this.rotA)
      this.ctx.restore();

    // update world coords of pen
		this.penX = x;
		this.penY = y;
  }

/*
 * @author Trevor McCauley, senocular.com
 * @version 1.0.2
 *
 */

	function lineLength(sx, sy, ex, ey)
	{
		if (typeof ex == "undefined")
			return Math.sqrt(sx*sx + sy*sy);
		var dx = ex - sx;
		var dy = ey - sy;
		return Math.sqrt(dx*dx + dy*dy);
	}

	CvsGraphCtx.prototype.targetMoveTo = function(x, y)
	{
		this.dashX = x;
		this.dashY = y;
    this.ctx.moveTo(x, y);
	}

	CvsGraphCtx.prototype.targetLineTo = function(x, y)
	{
		if (x == this.dashX && y == this.dashY)
			return;
		this.dashX = x;
		this.dashY = y;
    this.ctx.lineTo(x, y);
	}

  /**
   * Draws a dashed line in target using the current line style from the current drawing position
   * to (x, y); the current drawing position is then set to (x, y).
   */
	CvsGraphCtx.prototype.dashTo = function(x, y, onLength, offLength)
	{
		var overflow = 0;
		var isLine = true;
		var dashLength = onLength + offLength;
		var dx = x-this.dashX;
    var dy = y-this.dashY;
		var a = Math.atan2(dy, dx);
		var ca = Math.cos(a), sa = Math.sin(a);
		var segLength = lineLength(dx, dy);
		if (overflow)
		{
			if (overflow > segLength)
			{
				if (isLine)
					this.targetLineTo(x, y);
				else this.targetMoveTo(x, y);
				overflow -= segLength;
				return;
			}
			if (isLine)
				this.targetLineTo(this.dashX + ca*overflow, this.dashY + sa*overflow);
			else
				this.targetMoveTo(this.dashX + ca*overflow, this.dashY + sa*overflow);
			segLength -= overflow;
			overflow = 0;
			isLine = !isLine;
			if (!segLength)
				return;
		}

		var fullDashCount = Math.floor(segLength/dashLength);
		if (fullDashCount)
		{
			var onx = ca*onLength,	ony = sa*onLength;
			var offx = ca*offLength,	offy = sa*offLength;
			for (var i=0; i<fullDashCount; i++)
			{
				if (isLine)
				{
					this.targetLineTo(this.dashX+onx, this.dashY+ony);
					this.targetMoveTo(this.dashX+offx, this.dashY+offy);
				}
        else
				{
					this.targetMoveTo(this.dashX+offx, this.dashY+offy);
					this.targetLineTo(this.dashX+onx, this.dashY+ony);
				}
			}
			segLength -= dashLength*fullDashCount;
		}

		if (isLine)
		{
			if (segLength > onLength)
			{
				this.targetLineTo(this.dashX+ca*onLength, this.dashY+sa*onLength);
				this.targetMoveTo(x, y);
				overflow = offLength-(segLength-onLength);
				isLine = false;
			}
      else
			{
				this.targetLineTo(x, y);
				if (segLength == onLength)
				{
					overflow = 0;
					isLine = !isLine;
				}
        else
				{
					overflow = onLength-segLength;
					this.targetMoveTo(x, y);
				}
			}
		}
    else
		{
			if (segLength > offLength)
			{
				this.targetMoveTo(this.dashX+ca*offLength, this.dashY+sa*offLength);
				this.targetLineTo(x, y);
				overflow = onLength-(segLength-offLength);
				isLine = true;
			}
      else
			{
				this.targetMoveTo(x, y);
				if (segLength == offLength)
				{
					overflow = 0;
					isLine = !isLine;
				}
        else
					overflow = offLength-segLength;
			}
		}
	}

  CvsGraphCtx.prototype.polyLine = function(data) // data is either data[n] or data[n][2]
  {
    if (this.rotA)
    {
      this.ctx.save();
      // setup for rotation by rot degrees
      this.ctx.translate(this.rotX, this.rotY);   // move transform origin to the requested origin
      this.ctx.rotate(this.rotA);
      this.ctx.translate(-this.rotX, -this.rotY);   // move origin back
    }

    this._setCtx();   // set up the stroke and fill styles
    this.ctx.beginPath();    // reset current path to null and move to 0,0
    if (data[0][0] != undefined)    // data is 2D array (or 3D but just use first 2 values) x=data[n][0], y=data[n][1]
    {
      this.ctx.moveTo(this.vpLLx+this.xoffset+data[0][0]*this.xscl, this.vpLLy+this.yoffset+data[0][1]*this.yscl);
      for (var i=1; i<data.length; i++)
        this.ctx.lineTo(this.vpLLx+this.xoffset+data[i][0]*this.xscl, this.vpLLy+this.yoffset+data[i][1]*this.yscl);
      this.ctx.stroke();
      // now update pen position
      this.penX = data[data.length-1][0];
      this.penY = data[data.length-1][1];
    }
    else // data is a simple array x values are data[0], data[2] ... data[2*n], y values data[1] data[3].. data[2*n+1]
    {
      this.ctx.moveTo(this.vpLLx+this.xoffset+data[0]*this.xscl, this.vpLLy+this.yoffset+data[1]*this.yscl);
      for (var i=1; i<data.length/2; i++)
      {
        this.ctx.lineTo(this.vpLLx+this.xoffset+data[2*i]*this.xscl, this.vpLLy+this.yoffset+data[2*i+1]*this.yscl);
      }
      this.ctx.stroke();
      // now update pen position
      this.penX = data[data.length-2];
      this.penY = data[data.length-1];
    }

    if (this.rotA)
      this.ctx.restore();
  }

  CvsGraphCtx.prototype.quadBezier = function(c1x, c1y, x, y)
  {
    if (this.rotA)
    {
      this.ctx.save();
      // setup for rotation by rot degrees
      this.ctx.translate(this.rotX, this.rotY);   // move transform origin to the requested origin
      this.ctx.rotate(this.rotA);
      this.ctx.translate(-this.rotX, -this.rotY);   // move origin back
    }

    this._setCtx();   // set up the stroke and fill styles
    this.ctx.quadraticCurveTo(this.vpLLx+this.xoffset+c1x*this.xscl, this.vpLLy+this.yoffset+c1y*this.yscl,
                            this.vpLLx+this.xoffset+x*this.xscl, this.vpLLy+this.yoffset+y*this.yscl);
    this.ctx.stroke();

    if (this.rotA)
      this.ctx.restore();

    // update world coords of pen
		this.penX = x;
		this.penY = y;
  }

  CvsGraphCtx.prototype.cubicBezier = function(c1x, c1y, c2x, c2y, x, y)
  {
    if (this.rotA)
    {
      this.ctx.save();
      // setup for rotation by rot degrees
      this.ctx.translate(this.rotX, this.rotY);   // move transform origin to the requested origin
      this.ctx.rotate(this.rotA);
      this.ctx.translate(-this.rotX, -this.rotY);   // move origin back
    }

    this._setCtx();   // set up the stroke and fill styles
    this.ctx.bezierCurveTo(this.vpLLx+this.xoffset+c1x*this.xscl, this.vpLLy+this.yoffset+c1y*this.yscl,
                            this.vpLLx+this.xoffset+c2x*this.xscl, this.vpLLy+this.yoffset+c2y*this.yscl,
                            this.vpLLx+this.xoffset+x*this.xscl, this.vpLLy+this.yoffset+y*this.yscl);
    this.ctx.stroke();

    if (this.rotA)
      this.ctx.restore();

    // update world coords of pen
		this.penX = x;
		this.penY = y;
  }

  CvsGraphCtx.prototype.polygon = function(data, fillColor) // data is data[n][2]
  {
    /* Major difference from drawing a polyLine is
     * that the extra line segment is drawn from last data point back to the first
     * to ensure a closed shape that can be filled.
     * If fillColor is specified the polygon is filled with this color
     * If fillColor is missing the polygon is draw as an outline in the current pen color
     */

    var newCol = new RGBAColor(fillColor);

    if (this.rotA)
    {
      this.ctx.save();
      // setup for rotation by rot degrees
      this.ctx.translate(this.rotX, this.rotY);   // move transform origin to the requested origin
      this.ctx.rotate(this.rotA);
      this.ctx.translate(-this.rotX, -this.rotY);   // move origin back
    }

    this._setCtx();   // set up the stroke and fill styles
    this.ctx.beginPath();    // reset current path to null and move to 0,0
    if (data[0][0] != undefined)    // data is 2D array x=data[n][0], y=data[n][1]
    {
      this.ctx.moveTo(this.vpLLx+this.xoffset+data[0][0]*this.xscl, this.vpLLy+this.yoffset+data[0][1]*this.yscl);
      for (var i=1; i<data.length; i++)
        this.ctx.lineTo(this.vpLLx+this.xoffset+data[i][0]*this.xscl, this.vpLLy+this.yoffset+data[i][1]*this.yscl);
      this.ctx.lineTo(this.vpLLx+this.xoffset+data[0][0]*this.xscl, this.vpLLy+this.yoffset+data[0][1]*this.yscl);
      // update world coords of pen
  		this.penX = data[0][0];         // ends up back where it started
  		this.penY = data[0][1];
    }
    else // data is a simple array x values are data[0], data[2] ... data[2*n], y values data[1] data[3].. data[2*n+1]
    {
      this.ctx.moveTo(this.vpLLx+this.xoffset+data[0]*this.xscl, this.vpLLy+this.yoffset+data[1]*this.yscl);
      for (var i=1; i<data.length/2; i++)
        this.ctx.lineTo(this.vpLLx+this.xoffset+data[2*i]*this.xscl, this.vpLLy+this.yoffset+data[2*i+1]*this.yscl);
      this.ctx.lineTo(this.vpLLx+this.xoffset+data[0]*this.xscl, this.vpLLy+this.yoffset+data[1]*this.yscl);
      // update world coords of pen
  		this.penX = data[0];         // ends up back where it started
  		this.penY = data[1];
    }

    if (newCol.ok)
    {
      var hexCol = newCol.toRGBA();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = hexCol;
      this.ctx.fillStyle = hexCol;
      this.ctx.fill();
      this.ctx.stroke();
    }
    else
    {
      // just stoke the rectangle
      this.ctx.stroke();
    }
    this._setCtx();   // restore the stroke and fill styles

    if (this.rotA)
      this.ctx.restore();
  }

  CvsGraphCtx.prototype.arrow = function(x1, y1, x2, y2, size)
  {
    var a = 20;   // half angle of arrow head in degrees
    var scale = 2;     // default size
    var dx = (x2-x1)*this.xscl;         // pixels
    var dy = (y2-y1)*this.yscl;
    var theta = -Math.atan2(dy, dx);
    var phiL = theta + Math.PI - (a*Math.PI/180.0);
    var phiR = theta + Math.PI + (a*Math.PI/180.0);
    var phiC = theta + Math.PI;

    if (size != undefined)
      scale = size;
    if (size<1)
      scale = 1;
    if (size>9)
      scale = 9;

    var r = scale*(3+4*Math.sqrt(this.penWid));     // size of arrow head, at least as wide as the line
    var x3 = x2 + r*Math.cos(phiL)/this.xscl;
    var y3 = y2 - r*Math.sin(phiL)/this.yscl;
    var x4 = x2 + r*Math.cos(phiR)/this.xscl;
    var y4 = y2 - r*Math.sin(phiR)/this.yscl;
    var xs = x2 + 0.9*r*Math.cos(phiC)/this.xscl;
    var ys = y2 - 0.9*r*Math.sin(phiC)/this.yscl;

    if (this.rotA)
    {
      this.ctx.save();
      // setup for rotation by rot degrees
      this.ctx.translate(this.rotX, this.rotY);   // move transform origin to the requested origin
      this.ctx.rotate(this.rotA);
      this.ctx.translate(-this.rotX, -this.rotY);   // move origin back
    }

    this._setCtx();   // set up the stroke and fill styles
    this.ctx.beginPath();    // reset current path to null and move to 0,0
    this.ctx.moveTo(this.vpLLx+this.xoffset+x1*this.xscl, this.vpLLy+this.yoffset+y1*this.yscl);
    // stroke the line just short of the end so we get the sharp end point
    this.ctx.lineTo(this.vpLLx+this.xoffset+xs*this.xscl, this.vpLLy+this.yoffset+ys*this.yscl);
    this.ctx.stroke();
    this.ctx.moveTo(this.vpLLx+this.xoffset+x2*this.xscl, this.vpLLy+this.yoffset+y2*this.yscl);
    this.ctx.lineTo(this.vpLLx+this.xoffset+x3*this.xscl, this.vpLLy+this.yoffset+y3*this.yscl);
    this.ctx.lineTo(this.vpLLx+this.xoffset+x4*this.xscl, this.vpLLy+this.yoffset+y4*this.yscl);
    this.ctx.lineTo(this.vpLLx+this.xoffset+x2*this.xscl, this.vpLLy+this.yoffset+y2*this.yscl);
    this.ctx.fill();

    if (this.rotA)
      this.ctx.restore();

    // update world coords of pen
		this.penX = x2;
		this.penY = y2;
  }

  CvsGraphCtx.prototype.rect = function(x, y, w, h, fillColor)
  {
    if (this.rotA)
    {
      this.ctx.save();
      // setup for rotation by rot degrees
      this.ctx.translate(this.rotX, this.rotY);   // move transform origin to the requested origin
      this.ctx.rotate(this.rotA);
      this.ctx.translate(-this.rotX, -this.rotY);   // move origin back
    }

    this._setCtx();   // set up the stroke and fill styles

    var newCol = new RGBAColor(fillColor);

    if (newCol.ok)
    {
      this.ctx.fillStyle = newCol.toRGBA();
      this.ctx.fillRect(this.vpLLx+this.xoffset+x*this.xscl, this.vpLLy+this.yoffset+y*this.yscl, w*this.xscl, h*this.yscl);
    }
    else
    {
      // just stoke the rectangle
      this.ctx.strokeRect(this.vpLLx+this.xoffset+x*this.xscl, this.vpLLy+this.yoffset+y*this.yscl, w*this.xscl, h*this.yscl);
    }
    this._setCtx();   // restore the stroke and fill styles

    if (this.rotA)
      this.ctx.restore();
  }

  CvsGraphCtx.prototype.shape = function(shape, x, y, size, fillColor)
  {
    var xLofs, yLofs;  /* label origin offsets */
    var fill = false;

    var d = size*this.xscl;     // size in x axis units

    if (this.rotA)
    {
      this.ctx.save();
      // setup for rotation by rot degrees
      this.ctx.translate(this.rotX, this.rotY);   // move transform origin to the requested origin
      this.ctx.rotate(this.rotA);
      this.ctx.translate(-this.rotX, -this.rotY);   // move origin back
    }

    this._setCtx();   // set up the stroke and fill styles
    var newCol = new RGBAColor(fillColor);
    if (newCol.ok)                          // else color doesn't change uses penCol
    {
      this.ctx.fillStyle = newCol.toRGBA();
      fill = true;
    }
    switch (shape)
    {
      case "square":
        xLofs = -0.5*d;
        yLofs = -0.5*d;
        if (fill)
          this.ctx.fillRect(this.vpLLx+this.xoffset+x*this.xscl+xLofs, this.vpLLy+this.yoffset+y*this.yscl+yLofs, d, d);
        else
          this.ctx.strokeRect(this.vpLLx+this.xoffset+x*this.xscl+xLofs, this.vpLLy+this.yoffset+y*this.yscl+yLofs, d, d);
        break;
      case "triangle":
        this.ctx.beginPath();                             // Begin a shape
        xLofs = 0;
        yLofs = -0.5747*d;
        this.ctx.moveTo(this.vpLLx+this.xoffset+x*this.xscl+xLofs, this.vpLLy+this.yoffset+y*this.yscl+yLofs);
        xLofs = 0.5*d;
        yLofs = 0.2887*d;
        this.ctx.lineTo(this.vpLLx+this.xoffset+x*this.xscl+xLofs, this.vpLLy+this.yoffset+y*this.yscl+yLofs);
        xLofs = -0.5*d;
        yLofs = 0.2887*d;
        this.ctx.lineTo(this.vpLLx+this.xoffset+x*this.xscl+xLofs, this.vpLLy+this.yoffset+y*this.yscl+yLofs);
        this.ctx.closePath();
        if (fill)
          this.ctx.fill();                                  // Fill the shape
        else
          this.ctx.stroke();
        break;
      case "circle":
      default:
        // method of drawing circle with an arc in excanvas is sensitve:
        // IE will not render if arc goes from 0 to 2*PI so stop short and join
        var ccw = false;
 
        this.ctx.beginPath();
        this.ctx.arc(this.vpLLx+this.xoffset+x*this.xscl, this.vpLLy+this.yoffset+y*this.yscl, 0.5*d, 0, 1.95*Math.PI, ccw);
        this.ctx.closePath();  // not required for fills
        if (fill)
          this.ctx.fill();
        else
          this.ctx.stroke();
    }                                  // Fill the shape
    this._setCtx();   // restore the stroke and fill styles

    if (this.rotA)
      this.ctx.restore();
  }

  CvsGraphCtx.prototype.drawImg = function(imgURL, x, y, w, lorg, degs)
  {
    var img = new Image();

    // load the image
    img.src = imgURL;

    this.updateImg(img, x, y, w, lorg, degs);

    return img;
  }

  CvsGraphCtx.prototype.updateImg = function(img, x, y, w, lorg, degs)
  {
    var savThis = this;         // save 'this' for the closure when called back
    var savRotX = this.rotX;    // this try to save the rotation values when updateImg first called
    var savRotY = this.rotY;    // when internal function colled by timer these will have reset to 0
    var savRotA = this.rotA;

    function updateImgCallback()
    {
      if ((img.complete)&&(!_busy[this.cId]))  // image loaded? engine busy?
      {
        _busy[this.cId] = true;
        modifyImg.call(savThis, img, x, y, w, lorg, degs, savRotX, savRotY, savRotA);
        _busy[this.cId] = false;
      }
      else  // not loaded yet
      {
        setTimeout(function(){updateImgCallback.call(savThis)}, 50);
      }
    }

    updateImgCallback();
  }

  function modifyImg(img, x, y, w, lorg, degs, rotX, rotY, rotA)
  {
    var reScale = w*this.xscl/img.width;   // canvas is to be scaled by this pixel ratio
    var xLofs, yLofs;  /* label origin offsets */
    var rot = 0;

    if (degs != undefined)
      rot = -degs*Math.PI/180.0;      // measure angles counter clockwise

    switch (lorg)
    {
      case 1:
        xLofs = 0;
        yLofs = 0;
        break;
      case 2:
        xLofs = 0.5*img.width;          // work in pixels assume image already scaled
        yLofs = 0;
        break;
      case 3:
        xLofs = img.width;
        yLofs = 0;
        break;
      case 4:
        xLofs = 0;
        yLofs = 0.5*img.height;
        break;
      case 5:
        xLofs = 0.5*img.width;
        yLofs = 0.5*img.height;
        break;
      case 6:
        xLofs = img.width;
        yLofs = 0.5*img.height;
        break;
      case 7:
        xLofs = 0;
        yLofs = img.height;
        break;
      case 8:
        xLofs = 0.5*img.width;
        yLofs = img.height;
        break;
      case 9:
        xLofs = img.width;
        yLofs = img.height;
        break;
      default:
        xLofs = 0;
        yLofs = 0;
    }

    this.ctx.save();   // save the clean ctx

    if (rotA)      // world coords may be rotated
    {
      // setup for rotation by rot degrees
      this.ctx.translate(rotX, rotY);   // move transform origin to the requested origin
      this.ctx.rotate(rotA);
      this.ctx.translate(-rotX, -rotY);   // move origin back
    }
    // This is just the image getting raotated abot the Lorg point
    this.ctx.translate(this.vpLLx+x*this.xscl+this.xoffset, this.vpLLy+y*this.yscl+this.yoffset);
    this.ctx.rotate(rot);

    this.ctx.drawImage(img, -reScale*xLofs, -reScale*yLofs, reScale*img.width, reScale*img.height);
    this.ctx.restore();
  }

  CvsGraphCtx.prototype.label = function(str, x, y, lorg, degs, ptSize)
  {
    var fSize = this.fontSize;
    var xLofs, yLofs;  /* label origin offsets */
    var rot = 0;

    if (degs != undefined)
      rot = -degs*Math.PI/180.0;      // measure angles counter clockwise

    if ((ptSize != undefined)&&(ptSize>4))    // ptSize is points
      fSize = ptSize;

    var strLen = CanvasTextFunctions.measure(0, fSize, str);

    /* Note: char cell is 33 pixels high, char size is 21 pixels (0 to 21), decenders go to -7 to 21.
       passing 'size' to text function scales char height by size/25.
       So reference height for vertically alignment is charHeight = 21/25 (=0.84) of the fontSize. */
    switch (lorg)
    {
      case 1:
      default:
        xLofs = 0;
        yLofs = 0.84*fSize;
        break;
      case 2:
        xLofs = 0.5*strLen;
        yLofs = 0.84*fSize;
        break;
      case 3:
        xLofs = strLen;
        yLofs = 0.84*fSize;
        break;
      case 4:
        xLofs = 0;
        yLofs = 0.42*fSize;
        break;
      case 5:
        xLofs = 0.5*strLen;
        yLofs = 0.42*fSize;
        break;
      case 6:
        xLofs = strLen;
        yLofs = 0.42*fSize;
        break;
      case 7:
        xLofs = 0;
        yLofs = 0;
        break;
      case 8:
        xLofs = 0.5*strLen;
        yLofs = 0;
        break;
      case 9:
        xLofs = strLen;
        yLofs = 0;
        break;
    }
    this.ctx.save();   // save the clean ctx

    if (this.rotA)
    {
      // setup for rotation by rot degrees
      this.ctx.translate(this.rotX, this.rotY);   // move transform origin to the requested origin
      this.ctx.rotate(this.rotA);
      this.ctx.translate(-this.rotX, -this.rotY);   // move origin back
    }

    this._setCtx();   // set up the stroke and fill styles
    // setup for rotation by rot degrees
    this.ctx.translate(this.vpLLx+x*this.xscl+this.xoffset, this.vpLLy+y*this.yscl+this.yoffset);       // move origin to the lorg point of the text
    this.ctx.rotate(rot);
    CanvasTextFunctions.draw(this.ctx, 0, fSize, -xLofs, yLofs, str);
    this.ctx.restore();
  }

  // copy the basic graphics context values (for an overlay)
  CvsGraphCtx.prototype.dupCtx = function(src_graphCtx)
  {
    // copy all the graphics context parameters into the overlay ctx.
    this.vpLLx = src_graphCtx.vpLLx;      // vp lower left from canvas left in pixels
    this.vpLLy = src_graphCtx.vpLLy;      // vp lower left from canvas top
    this.xscl = src_graphCtx.xscl;        // world x axis scale factor
    this.yscl = src_graphCtx.yscl;        // world y axis scale factor
    this.xoffset = src_graphCtx.xoffset;  // world x origin offset from viewport left in pixels
    this.yoffset = src_graphCtx.yoffset;  // world y origin offset from viewport bottom in pixels
    this.penCol = src_graphCtx.penCol;
    this.penWid = src_graphCtx.penWid;    // pixels
    this.bkgCol = src_graphCtx.bkgCol;
    this.fontSize = src_graphCtx.fontSize;
    this.penX = src_graphCtx.penX;
    this.penY = src_graphCtx.penY;
  }
