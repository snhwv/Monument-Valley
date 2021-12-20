const componentMap: Record<string, any> = {};
const modules = import.meta.globEager("./*.ts");
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  componentMap[mod.name] = mod;
});

const componentTypes = Object.keys(componentMap);
export { componentMap, componentTypes };
