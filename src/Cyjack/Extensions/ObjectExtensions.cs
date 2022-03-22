namespace Cyjack.Extensions
{
    public static class ObjectExtensions
    {
        public static void ShouldNotBeNull(this object source, string name)
        {
            if (source == null)
            {
                throw new ArgumentNullException($"{name} should not be null.");
            }
        }
    }
}
