/**
 * @author Kuitos
 * @since 2019-05-15
 */

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
