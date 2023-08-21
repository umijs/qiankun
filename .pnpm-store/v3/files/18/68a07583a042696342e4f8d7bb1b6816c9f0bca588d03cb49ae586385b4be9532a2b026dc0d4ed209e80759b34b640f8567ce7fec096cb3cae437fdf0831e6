export interface ExampleBaseAsset {
  /**
   * The export module identifier of related atom asset
   */
  atomAssetId: string;
  /**
   * The identifier from design draft of atom asset, such as Sketch symbol name
   */
  designId?: string;
  /**
   * identifier for asset
   */
  identifier: string;
  /**
   * uuid for asset
   * @deprecated  legacy HiTu DSM logic
   */
  uuid?: string;
  /**
   * Example asset name
   */
  name: string;
  'name.en-US'?: string;
  /**
   * Example asset description
   */
  description?: string;
  'description.en-US'?: string;
  /**
   * Preview URL
   */
  previewUrl?: string;
  /**
   * Thumbnail URL
   */
  thumbnail?: string;
  /**
   * Example tags
   */
  tags?: string[];
}

/**
 * Block example asset type definition
 * @note  for example, a danger Button component with form is a block exmaple asset
 */
export interface ExampleBlockAsset extends ExampleBaseAsset {
  type: 'BLOCK';
  /**
   * The dependencies of example asset
   * @note  a npm package can be used as a dependency, a local file alse can be used as a dependency
   */
  dependencies: Record<string, {
      /**
       * Dependency type
       * @note  NPM:  a npm package dependency, like antd
       *        FILE: a local file dependency, like a .less file
       */
      type: 'NPM' | 'FILE';
      /**
       * Dependency value
       * @note  NPM:  a npm package version or a specific git url
       *        FILE: a local file content
       */
      value: string;
    }>;
}

/**
 * Component example asset type definition
 * @note  for example, a danger demo of Button component is a component exmaple asset
 */
export interface ExampleComponentAsset extends ExampleBaseAsset {
  type: 'COMPONENT';
  /**
   * TODO: the props values of component
   */
  props: any;
}

type ExampleAsset = ExampleComponentAsset | ExampleBlockAsset;

export default ExampleAsset;
