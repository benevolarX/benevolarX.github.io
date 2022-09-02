"use strict";

class Pseudo extends HTMLSpanElement
{
	constructor()
	{
		super();
		this.m_id_compte = this.hasAttribute("num") ? this.getAttribute("num") : -1;
	}

	connectedCallback() 
	{
	}

	disconnectedCallback()
	{
		this.removeChild(this.span);
	}

	get id_compte() { return this.m_id_compte; }
	set id_compte(val) { this.m_id_compte = val; }

}

window.customElements.define('pseudo-joueur', Pseudo, { extends: 'span' });
