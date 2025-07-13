
import React from 'react'
import { Checklist, Search, ModeEditOutline, Toc } from "@mui/icons-material"
import { Button } from '@mui/material';

const Header = ({ tab, setTab }) => {
  return (
    <nav>
        <Button variant={tab == "outline" ? "contained" : "outlined"} color="info" startIcon={<Checklist /> } onClick={() => setTab("outline")}></Button>
        <Button variant={tab === "search" ? "contained" : "outlined"} color="info" startIcon={<Search /> }></Button>
        <Button variant={tab === "writing" ? "contained" : "outlined"} color="info" startIcon={<ModeEditOutline /> } onClick={() => setTab("writing")}></Button>
        <Button variant={tab === "toc" ? "contained" : "outlined"} color="info" startIcon={<Toc /> } onClick={() => setTab("toc")}></Button>

    </nav>
  )
}

export default Header