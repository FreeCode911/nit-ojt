<?php

namespace App\View\Components;

use Illuminate\View\Component;

class Island extends Component
{
    public string $component;

    public array $props;

    public array $state;

    public ?string $id;

    public function __construct(string $component, array $props = [], array $state = [], ?string $id = null)
    {
        $this->component = $component;
        $this->props = $props;
        $this->state = $state;
        $this->id = $id ?? 'island_'.uniqid();
    }

    public function render()
    {
        $attributes = [
            'data-island' => $this->component,
            'data-island-props' => json_encode($this->props),
            'data-island-state' => json_encode($this->state),
            'data-island-id' => $this->id,
        ];

        $attrs = '';
        foreach ($attributes as $key => $value) {
            $attrs .= $key.'="'.$value.'" ';
        }

        return '<div '.trim($attrs).'></div>';
    }
}
