/**
 * LittleJS Post Processing Plugin
 * - Supports shadertoy style post processing shaders
 * - call glInitPostProcess
 */

'use strict';

///////////////////////////////////////////////////////////////////////////////
// post processing - can be enabled to pass other canvases through a final shader

let glPostShader, glPostTexture, glPostIncludeOverlay;
let postProcessEnabled = true;

/** Set up a post processing shader
 *  @param {String} shaderCode
 *  @param {Boolean} includeOverlay
 *  @memberof WebGL */
function initPostProcess(shaderCode, includeOverlay=false)
{
    ASSERT(!glPostShader, 'can only have 1 post effects shader');
    if (headlessMode) return;
    
    if (!shaderCode) // default shader pass through
        shaderCode = 'void mainImage(out vec4 c,vec2 p){c=texture(iChannel0,p/iResolution.xy);}';

    // create the shader
    glPostShader = glCreateProgram(
        '#version 300 es\n' +            // specify GLSL ES version
        'precision highp float;'+        // use highp for better accuracy
        'in vec2 p;'+                    // position
        'void main(){'+                  // shader entry point
        'gl_Position=vec4(p+p-1.,1,1);'+ // set position
        '}'                              // end of shader
        ,
        '#version 300 es\n' +            // specify GLSL ES version
        'precision highp float;'+        // use highp for better accuracy
        'uniform sampler2D iChannel0;'+  // input texture
        'uniform vec3 iResolution;'+     // size of output texture
        'uniform float iTime;'+          // time
        'out vec4 c;'+                   // out color
        '\n' + shaderCode + '\n'+        // insert custom shader code
        'void main(){'+                  // shader entry point
        'mainImage(c,gl_FragCoord.xy);'+ // call post process function
        'c.a=1.;'+                       // always use full alpha
        '}'                              // end of shader
    );

    // create buffer and texture
    glPostTexture = glCreateTexture(undefined);
    glPostIncludeOverlay = includeOverlay;

    // Render the post processing shader, called automatically by the engine
    engineAddPlugin(undefined, postProcessRender);
    function postProcessRender()
    {
        if (headlessMode || !postProcessEnabled) return;
        
        // prepare to render post process shader
        if (glEnable)
        {
            glFlush(); // clear out the buffer
            mainContext.drawImage(glCanvas, 0, 0); // copy to the main canvas
        }
        else
        {
            // set the viewport
            glContext.viewport(0, 0, glCanvas.width = mainCanvas.width, glCanvas.height = mainCanvas.height);
        }

        if (glPostIncludeOverlay)
        {
            // copy overlay canvas so it will be included in post processing
            mainContext.drawImage(overlayCanvas, 0, 0);
            overlayCanvas.width |= 0;
        }

        // setup shader program to draw one triangle
        glContext.useProgram(glPostShader);
        glContext.bindBuffer(gl_ARRAY_BUFFER, glGeometryBuffer);
        glContext.pixelStorei(gl_UNPACK_FLIP_Y_WEBGL, 1);
        glContext.disable(gl_BLEND);

        // set textures, pass in the 2d canvas and gl canvas in separate texture channels
        glContext.activeTexture(gl_TEXTURE0);
        glContext.bindTexture(gl_TEXTURE_2D, glPostTexture);
        glContext.texImage2D(gl_TEXTURE_2D, 0, gl_RGBA, gl_RGBA, gl_UNSIGNED_BYTE, mainCanvas);

        // set vertex position attribute
        const vertexByteStride = 8;
        const pLocation = glContext.getAttribLocation(glPostShader, 'p');
        glContext.enableVertexAttribArray(pLocation);
        glContext.vertexAttribPointer(pLocation, 2, gl_FLOAT, false, vertexByteStride, 0);

        // set uniforms and draw
        const uniformLocation = (name)=>glContext.getUniformLocation(glPostShader, name);
        glContext.uniform1i(uniformLocation('iChannel0'), 0);
        glContext.uniform1f(uniformLocation('iTime'), time);
        glContext.uniform3f(uniformLocation('iResolution'), mainCanvas.width, mainCanvas.height, 1);
        glContext.drawArrays(gl_TRIANGLE_STRIP, 0, 4);
    }
}

function setupPostProcess()
{
    const televisionShader = `
    // Simple TV Shader Code
    float hash(vec2 p)
    {
        p=fract(p*.3197);
        return fract(1.+sin(51.*p.x+73.*p.y)*13753.3);
    }
    float noise(vec2 p)
    {
        vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+1.),u.x),u.y);
    }
    void mainImage(out vec4 c, vec2 p)
    {
        // put uv in texture pixel space
        p /= iResolution.xy;

        // apply fuzz as horizontal offset
        const float fuzz = .0007;
        const float fuzzScale = 500.;
        const float fuzzSpeed = 0.7;
        p.x += fuzz*(noise(vec2(p.y*fuzzScale, iTime*fuzzSpeed))*2.-1.);

        // init output color
        c = texture(iChannel0, p);

        // chromatic aberration
        const float chromatic = .001;
        c.r = texture(iChannel0, p - vec2(chromatic,0)).r;
        c.b = texture(iChannel0, p + vec2(chromatic,0)).b;

        // tv static noise
        const float staticNoise = .04;
        c += staticNoise * hash(p + mod(iTime, 1e3));

        // scan lines
        const float scanlineScale = 1e3;
        const float scanlineAlpha = .03;
        c *= 1. + scanlineAlpha*sin(p.y*scanlineScale);

        // black vignette around edges
        const float vignette = 2.2;
        const float vignettePow = 1.2;
        float dx = 2.*p.x-1., dy = 2.*p.y-1.;
        c *= 1.-pow((dx*dx + dy*dy)/vignette, vignettePow);
    }`;

    const includeOverlay = true;
    initPostProcess(televisionShader, includeOverlay);
}