export function Favicon({ size }: { size: number }) {
  return (
    <div
      style={{
        fontSize: size * 0.75,
        background: 'rgb(209, 250, 229)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      🏃‍♂️
    </div>
  );
}
