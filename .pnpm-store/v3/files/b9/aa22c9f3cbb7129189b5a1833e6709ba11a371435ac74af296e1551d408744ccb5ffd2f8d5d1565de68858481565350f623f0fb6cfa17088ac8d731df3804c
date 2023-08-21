/**
 * Atom asset type definition
 * @note  for example, a Button component is an atom asset
 */

export type AtomPropsDefinition = Record<string, {
    /**
     * component property name
     */
    identifier: string;
    /**
     * component property label
     */
    name?: string;
    /**
     * component property description
     */
    description?: string;
    'description.zh-CN'?: string;
    'description.en-US'?: string;
    /**
     * component property type
     */
    type: string;
    /**
     * component property default value
     */
    default?: string;
    /**
     * property whether required
     */
    required?: true;
  }[]>;

export default interface AtomAsset {
  /**
   * The export module identifier of atom asset
   */
  identifier: string;
  /**
   * Atom asset name
   */
  name: string;
  /**
   * Atom asset English name
   */
  'name.en-US'?: string;
  /**
   * atom uuid
   * @deprecated  legacy HiTu DSM logic
   */
  uuid?: string;
  /**
   * the API spec of atom asset
   */
  props: AtomPropsDefinition;
}
