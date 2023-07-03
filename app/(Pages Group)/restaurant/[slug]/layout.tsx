type Props = {
  children: React.ReactNode;
};

export default function RestaurantLayout({ children }: Props) {
  return <div className="py-20 bg-[#16132d]">{children}</div>;
}
