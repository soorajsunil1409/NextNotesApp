const Navbar = () => {
  return (
    <div className="p-8 px-10 flex text-center justify-between items-center">
      <div className="text-4xl font-semibold">NOTES</div>
      <input type="text" className="p-3 px-6 bg-secondary w-[300px] outline-0 text-white rounded-3xl" placeholder="Search" />
      <div className="flex items-center gap-3">
        <div>Sooraj S Namboothiry</div>
        <div className="size-[50px] bg-secondary rounded-full"></div>
      </div>
    </div>
  )
}
export default Navbar