import * as dat from 'dat.gui'


const gui = new dat.GUI()
// const debugObject = {
//   color: '#FF00CC'
// }


// gui.addColor(debugObject, 'color').name('Color').onChange(() => {
//   cubeMaterial.color = new THREE.Color(debugObject.color)
// })

// gui.add(cube.rotation, 'x').min(0).max(Math.PI * 2).step(0.01).name('RotationX')
// gui.add(cube.rotation, 'y').min(0).max(Math.PI * 2).step(0.01).name('RotationY')
// gui.add(cube.rotation, 'z').min(0).max(Math.PI * 2).step(0.01).name('RotationZ')

if (import.meta.env.PROD) {
  gui.hide()
  window.showGUI = () => gui.show()
}
