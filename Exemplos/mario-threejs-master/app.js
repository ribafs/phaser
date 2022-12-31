window.addEventListener('load', initialize)

function initialize() {
  // world init
  var world = new World()
  world.setRender()
  world.setCameraPosition()
  world.setLighting()

  // geometry,mesh,material init
  var geometry = new THREE.CubeGeometry( 1, 1, 1 )
  var mergedMarioGeometry = new THREE.Geometry()
  var cubeMario = new CubeCreature()

  // creates Cube objects from our mario JSON
  for ( var i = 0, len = mario.cubeAttributes.length; i < len; i++ ){
    cubeMario.cubes.push ( new Cube( geometry, mario.cubeAttributes[ i ].position, mario.cubeAttributes[ i ].color ) )
  }

  // merge each Cube's mesh into the mergedMarioGeometry.
  cubeMario.mergeCubes(mergedMarioGeometry)

  // merge cubeMario.materials array into final mesh
  var mergedMarioMesh = new THREE.Mesh( mergedMarioGeometry, new THREE.MeshFaceMaterial( cubeMario.materials ) )
  world.setScene( mergedMarioMesh )
  world.render( mergedMarioMesh )
}

function Cube( geometry, position, color ) {
  this.color = new THREE.Color( color )
  this.mesh = new THREE.Mesh( geometry )
  this.mesh.position.x = position.x
  this.mesh.position.y = position.y
  this.mesh.position.z = position.z
}

function CubeCreature(){
  this.cubes = []
  this.materials = []
}

CubeCreature.prototype = {
  mergeCubes: function( geometryToMerge ){
    for ( var i=0, len = this.cubes.length; i < len; i++ ){
      this.materials.push ( new THREE.MeshLambertMaterial({ color: this.cubes[ i ].color }) )
      THREE.GeometryUtils.setMaterialIndex(this.cubes[ i ].mesh.geometry, i )
      THREE.GeometryUtils.merge( geometryToMerge, this.cubes[ i ].mesh )
    }

  }
}

function World(){
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth/window.innerHeight, .1, 100 );
  this.renderer = new THREE.WebGLRenderer();
  this.controls = new THREE.OrbitControls( this.camera );
}

World.prototype = {
  setRender: function() {
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
  },

  render: function( mesh ) {
    var self = this
    requestAnimationFrame( function(){
     self.render( mesh )
   });

    this.renderer.render( this.scene, this.camera );
  },

  setCameraPosition: function(){
    this.camera.position.z = 30;
    this.camera.position.x = 4;
    this.camera.position.y = 3;
  },

  setLighting: function() {
    var frontLight = new THREE.DirectionalLight( 0xFFFFFF );
    var backLight = new THREE.DirectionalLight( 0xFFFA99 );
    frontLight.position.set( 3, 1, 10 ).normalize();
    backLight.position.set( 1, 2, -10 );
    this.scene.add( frontLight );
    this.scene.add( backLight );
  },

  setScene: function( mesh ) {
    this.scene.add( mesh );
  }
}
